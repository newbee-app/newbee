import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DocDocParams,
  DocEntity,
  OrgMemberDocParams,
  OrganizationEntity,
  QnaDocParams,
  QnaEntity,
  TeamEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { solrOrgConfigset, solrOrgDictionaries } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  organizationSlugNotFound,
  organizationSlugTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import slugify from 'slug';

/**
 * The service that interacts with the `OrganizationEntity`.
 */
@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
    private readonly teamService: TeamService,
  ) {}

  /**
   * Creates a new `OrganizationEntity` and makes the creator the owner.
   *
   * @param createOrganizationDto The information needed to create a new organization.
   * @param creator The `UserEntity` creating the organization.
   *
   * @returns A new `OrganizationEntity` instance.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async create(
    createOrganizationDto: CreateOrganizationDto,
    creator: UserEntity,
  ): Promise<OrganizationEntity> {
    return await this.em.transactional(
      async (em): Promise<OrganizationEntity> => {
        const { name, slug, upToDateDuration } = createOrganizationDto;
        const organization = new OrganizationEntity(
          name,
          slug,
          upToDateDuration,
          creator,
        );
        const { id } = organization;

        try {
          await em.persistAndFlush(organization);
        } catch (err) {
          if (err instanceof UniqueConstraintViolationException) {
            this.logger.error(err);
            throw new BadRequestException(organizationSlugTakenBadRequest);
          }

          throw err;
        }

        await this.solrCli.createCollection({
          name: id,
          numShards: 1,
          config: solrOrgConfigset,
        });

        // Should just be 1 member (the creator)
        await this.solrCli.addDocs(
          id,
          organization.members
            .getItems()
            .map((member) => new OrgMemberDocParams(member)),
        );

        return organization;
      },
    );
  }

  /**
   * Whether an organization with the given slug already exists in the database.
   *
   * @param slug The slug to check for.
   *
   * @returns `true` if the slug already exists in the database, `false` if not.
   */
  async hasOneBySlug(slug: string): Promise<boolean> {
    return !!(await this.em.findOne(OrganizationEntity, { slug }));
  }

  /**
   * Finds the `OrganizationEntity` in the database associated with the given slug.
   * Also builds the suggester for the org, if it's been at least a day since it was last built.
   *
   * @param slug The slug to look for.
   *
   * @returns The associated `OrganizationEntity` instance.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the org cannot be found.
   */
  async findOneBySlug(slug: string): Promise<OrganizationEntity> {
    let organization = await this.em.findOne(OrganizationEntity, {
      slug,
    });
    if (!organization) {
      throw new NotFoundException(organizationSlugNotFound);
    }

    // If it's been a day or more since the suggester was last built, build the suggester for the org
    const now = new Date();
    if (
      now.getTime() - organization.suggesterBuiltAt.getTime() >=
      86400000 /* 1 day in ms */
    ) {
      await this.buildSuggesters(organization);
      organization = this.em.assign(organization, { suggesterBuiltAt: now });
      await this.em.flush();
    }

    return organization;
  }

  /**
   * Updates the given `OrganizationEntity` and saves the changes to the database.
   *
   * @param organization The `OrganizationEntity` to update.
   * @param updateOrganizationDto The new details for the organization.
   *
   * @returns The updated `OrganizationEntity` instance.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async update(
    organization: OrganizationEntity,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    return await this.em.transactional(
      async (em): Promise<OrganizationEntity> => {
        const { slug, upToDateDuration } = updateOrganizationDto;
        if (slug) {
          updateOrganizationDto.slug = slugify(slug);
        }
        organization = em.assign(organization, updateOrganizationDto);
        const { docs, qnas } = await this.getAffectedPosts(
          organization,
          upToDateDuration,
        );

        if ((docs || qnas) && upToDateDuration) {
          const newDuration = dayjs.duration(upToDateDuration);
          [...docs, ...qnas].forEach((post) => {
            em.assign(post, {
              outOfDateAt: dayjs(post.markedUpToDateAt)
                .add(newDuration)
                .toDate(),
            });
          });
        }

        try {
          await this.em.flush();
        } catch (err) {
          if (err instanceof UniqueConstraintViolationException) {
            this.logger.error(err);
            throw new BadRequestException(organizationSlugTakenBadRequest);
          }

          throw err;
        }

        await this.solrCli.getVersionAndReplaceDocs(organization.id, [
          ...docs.map((doc) => new DocDocParams(doc)),
          ...qnas.map((qna) => new QnaDocParams(qna)),
        ]);

        return organization;
      },
    );
  }

  /**
   * Deletes the given `OrganizationEntity` and saves the changes to the database.
   *
   * @param organization The `OrganizationEntity` instance to delete.
   */
  async delete(organization: OrganizationEntity): Promise<void> {
    await this.em.transactional(async (em): Promise<void> => {
      const { id } = organization;
      await em.removeAndFlush(organization);
      await this.solrCli.deleteCollection(id);
    });
  }

  /**
   * Helper function for getting all child posts that use the organization's duration value for changing the organization's up-to-date duration.
   *
   * @param organization The organization whose duration changed.
   * @param upToDateDuration The new value for the up-to-date duration as an ISO 8601 duration string.
   *
   * @returns All of the posts that were updated.
   */
  async getAffectedPosts(
    organization: OrganizationEntity,
    upToDateDuration: string | undefined,
  ): Promise<{ docs: DocEntity[]; qnas: QnaEntity[] }> {
    if (
      upToDateDuration === undefined ||
      upToDateDuration === organization.upToDateDuration
    ) {
      return { docs: [], qnas: [] };
    }

    let allDocs: DocEntity[] = [];
    let allQnas: QnaEntity[] = [];

    const teams = await this.em.find(TeamEntity, {
      organization,
      upToDateDuration: null,
    });
    for (const team of teams) {
      const { docs, qnas } = await this.teamService.getAffectedPosts(
        team,
        upToDateDuration,
      );
      allDocs = allDocs.concat(docs);
      allQnas = allQnas.concat(qnas);
    }

    const docs = await this.em.find(DocEntity, {
      organization,
      team: null,
      upToDateDuration: null,
    });
    const qnas = await this.em.find(QnaEntity, {
      organization,
      team: null,
      upToDateDuration: null,
    });
    allDocs = allDocs.concat(docs);
    allQnas = allQnas.concat(qnas);

    return { docs: allDocs, qnas: allQnas };
  }

  /**
   * Send a request to build an organization's suggesters.
   *
   * @param organization The organization to build.
   */
  async buildSuggesters(organization: OrganizationEntity): Promise<void> {
    for (const dictionary of Object.values(solrOrgDictionaries)) {
      await this.solrCli.suggest(organization.id, {
        params: { 'suggest.build': true, 'suggest.dictionary': dictionary },
      });
    }
  }
}
