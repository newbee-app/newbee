import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DocDocParams,
  DocEntity,
  EntityService,
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
  internalServerError,
  organizationSlugNotFound,
  organizationSlugTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import slugify from 'slug';
import { v4 } from 'uuid';

/**
 * The service that interacts with the `OrganizationEntity`.
 */
@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
    private readonly entityService: EntityService,
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
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    createOrganizationDto: CreateOrganizationDto,
    creator: UserEntity,
  ): Promise<OrganizationEntity> {
    const { name, slug, upToDateDuration } = createOrganizationDto;
    const id = v4();
    const organization = new OrganizationEntity(
      id,
      name,
      slug,
      upToDateDuration,
      creator,
    );

    try {
      await this.em.persistAndFlush(organization);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(organizationSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    try {
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
    } catch (err) {
      this.logger.error(err);
      await this.em.removeAndFlush(organization);
      throw new InternalServerErrorException(internalServerError);
    }

    return organization;
  }

  /**
   * Whether an organization with the given slug already exists in the database.
   *
   * @param slug The slug to check for.
   *
   * @returns `true` if the slug already exists in the database, `false` if not.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async hasOneBySlug(slug: string): Promise<boolean> {
    try {
      return !!(await this.em.findOne(OrganizationEntity, { slug }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `OrganizationEntity` in the database associated with the given slug.
   * Also builds the suggester for the org, if it's been at least a day since it was last built.
   *
   * @param slug The slug to look for.
   *
   * @returns The associated `OrganizationEntity` instance.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneBySlug(slug: string): Promise<OrganizationEntity> {
    try {
      let organization = await this.em.findOneOrFail(OrganizationEntity, {
        slug,
      });

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
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(organizationSlugNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the given `OrganizationEntity` and saves the changes to the database.
   *
   * @param organization The `OrganizationEntity` to update.
   * @param updateOrganizationDto The new details for the organization.
   *
   * @returns The updated `OrganizationEntity` instance.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async update(
    organization: OrganizationEntity,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    const { slug, upToDateDuration } = updateOrganizationDto;
    if (slug) {
      updateOrganizationDto.slug = slugify(slug);
    }

    const updatedOrganization = this.em.assign(
      organization,
      updateOrganizationDto,
    );

    const { docs, qnas } = await this.changeUpToDateDuration(
      organization,
      upToDateDuration,
    );

    try {
      await this.em.flush();
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(organizationSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.getVersionAndReplaceDocs(organization.id, [
        ...docs.map((doc) => new DocDocParams(doc)),
        ...qnas.map((qna) => new QnaDocParams(qna)),
      ]);
    } catch (err) {
      this.logger.error(err);
    }

    return updatedOrganization;
  }

  /**
   * Deletes the given `OrganizationEntity` and saves the changes to the database.
   *
   * @param organization The `OrganizationEntity` instance to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(organization: OrganizationEntity): Promise<void> {
    const { id } = organization;
    await this.entityService.safeToDelete(organization);
    try {
      await this.em.removeAndFlush(organization);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.deleteCollection(id);
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Helper function for changing out-of-date datetimes for all child posts that use the organization's duration value.
   *
   * @param organization The organization whose duration changed.
   * @param upToDateDuration The new value for the up-to-date duration as an ISO 8601 duration string.
   *
   * @returns All of the posts that were updated.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any error.
   */
  async changeUpToDateDuration(
    organization: OrganizationEntity,
    upToDateDuration: string | undefined,
  ): Promise<{ docs: DocEntity[]; qnas: QnaEntity[] }> {
    if (
      upToDateDuration === undefined ||
      upToDateDuration === organization.upToDateDuration
    ) {
      return { docs: [], qnas: [] };
    }

    try {
      let allDocs: DocEntity[] = [];
      let allQnas: QnaEntity[] = [];

      const teams = await this.em.find(TeamEntity, {
        organization,
        upToDateDuration: null,
      });
      teams.forEach(async (team) => {
        const { docs, qnas } = await this.teamService.changeUpToDateDuration(
          team,
          upToDateDuration,
        );
        allDocs = allDocs.concat(docs);
        allQnas = allQnas.concat(qnas);
      });

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

      const newDuration = dayjs.duration(upToDateDuration);
      [...docs, ...qnas].forEach((post) => {
        this.em.assign(post, {
          outOfDateAt: dayjs(post.markedUpToDateAt).add(newDuration).toDate(),
        });
      });
      allDocs = allDocs.concat(docs);
      allQnas = allQnas.concat(qnas);

      return { docs: allDocs, qnas: allQnas };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Send a request to build an organization's suggesters.
   *
   * @param organization The organization to build.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr CLI throws an error.
   */
  async buildSuggesters(organization: OrganizationEntity): Promise<void> {
    try {
      for (const dictionary of Object.values(solrOrgDictionaries)) {
        await this.solrCli.suggest(organization.id, {
          params: { 'suggest.build': true, 'suggest.dictionary': dictionary },
        });
      }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
