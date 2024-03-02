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
  OrgMemberEntity,
  OrganizationEntity,
  QnaDocParams,
  QnaEntity,
  TeamDocParams,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import {
  CreateTeamDto,
  UpdateTeamDto,
  teamSlugNotFound,
  teamSlugTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';

/**
 * The service that interacts with the `TeamEntity`.
 */
@Injectable()
export class TeamService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(TeamService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
  ) {}

  /**
   * Creates a new `TeamEntity` and associates it with its relevant `OrganizationEntity` and marks the creator as the team's owner.
   *
   * @param createTeamDto The information needed to create a new team.
   * @param creator The `OrgMemberEntity` that represents a user within the organization creating the team. The `organization` portion of the entity must be populated.
   *
   * @returns A new `TeamEntity` instance.
   * @throws {BadRequestException} `teamSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async create(
    createTeamDto: CreateTeamDto,
    creator: OrgMemberEntity,
  ): Promise<TeamEntity> {
    return await this.em.transactional(async (em): Promise<TeamEntity> => {
      const { name, slug, upToDateDuration } = createTeamDto;
      const { organization } = creator;
      const team = new TeamEntity(name, slug, upToDateDuration, creator);

      try {
        await em.persistAndFlush(team);
      } catch (err) {
        if (err instanceof UniqueConstraintViolationException) {
          this.logger.error(err);
          throw new BadRequestException(teamSlugTakenBadRequest);
        }

        throw err;
      }

      await this.solrCli.addDocs(organization.id, new TeamDocParams(team));
      return team;
    });
  }

  /**
   * Whether a team with the given slug already exists within the organization.
   *
   * @param organization The organization to look in.
   * @param slug The slug to check for.
   *
   * @returns `true` if the slug already exists in the organization, `false` if not.
   */
  async hasOneByOrgAndSlug(
    organization: OrganizationEntity,
    slug: string,
  ): Promise<boolean> {
    return !!(await this.em.findOne(TeamEntity, { organization, slug }));
  }

  /**
   * Finds the `TeamEntity` associated with the given slug and organization.
   *
   * @param organization The organization the team belongs to.
   * @param slug The slug to look for.
   *
   * @returns The associated `TeamEntity` instance.
   * @throws {NotFoundException} `teamSlugNotFound`. If the team cannot be found.
   */
  async findOneByOrgAndSlug(
    organization: OrganizationEntity,
    slug: string,
  ): Promise<TeamEntity> {
    const team = await this.em.findOne(TeamEntity, {
      organization,
      slug,
    });
    if (!team) {
      throw new NotFoundException(teamSlugNotFound);
    }
    return team;
  }

  /**
   * Updates the given `TeamEntity` and saves the changes to the database.
   *
   * @param team The `TeamEntity` to update.
   * @param updateTeamDto The new details for the team.
   *
   * @returns The updated `TeamEntity` instance.
   * @throws {BadRequestException} `teamSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async update(
    team: TeamEntity,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamEntity> {
    return await this.em.transactional(async (em): Promise<TeamEntity> => {
      const updatedTeam = em.assign(team, updateTeamDto);
      const { upToDateDuration } = updateTeamDto;
      const { docs, qnas } = await this.getAffectedPosts(
        team,
        upToDateDuration,
      );

      if ((docs || qnas) && upToDateDuration !== undefined) {
        const newDuration = dayjs.duration(
          upToDateDuration ?? team.organization.upToDateDuration,
        );
        [...docs, ...qnas].forEach((post) => {
          em.assign(post, {
            outOfDateAt: dayjs(post.markedUpToDateAt).add(newDuration).toDate(),
          });
        });
      }

      try {
        await em.flush();
      } catch (err) {
        if (err instanceof UniqueConstraintViolationException) {
          this.logger.error(err);
          throw new BadRequestException(teamSlugTakenBadRequest);
        }

        throw err;
      }

      await this.solrCli.getVersionAndReplaceDocs(team.organization.id, [
        new TeamDocParams(updatedTeam),
        ...docs.map((doc) => new DocDocParams(doc)),
        ...qnas.map((qna) => new QnaDocParams(qna)),
      ]);

      return updatedTeam;
    });
  }

  /**
   * Deletes the given `TeamEntity` and saves the changes to the database.
   *
   * @param team The `TeamEntity` instance to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(team: TeamEntity): Promise<void> {
    await this.em.transactional(async (em): Promise<void> => {
      const { id } = team;
      await em.removeAndFlush(team);
      await this.solrCli.deleteDocs(team.organization.id, [
        { id },
        { query: `team:${id}` },
      ]);
    });
  }

  /**
   * Helper function for changing the out-of-date datetimes for all child posts that use the team's duration value.
   *
   * @param team The team whose duration changed.
   * @param upToDateDuration The new value for the up-to-date duration as an ISO 8601 duration string.
   *
   * @returns All of the posts that were updated.
   */
  async getAffectedPosts(
    team: TeamEntity,
    upToDateDuration: string | null | undefined,
  ): Promise<{ docs: DocEntity[]; qnas: QnaEntity[] }> {
    if (
      upToDateDuration === undefined ||
      upToDateDuration === team.upToDateDuration
    ) {
      return { docs: [], qnas: [] };
    }

    const docs = await this.em.find(DocEntity, {
      team,
      upToDateDuration: null,
    });
    const qnas = await this.em.find(QnaEntity, {
      team,
      upToDateDuration: null,
    });

    return { docs, qnas };
  }
}
