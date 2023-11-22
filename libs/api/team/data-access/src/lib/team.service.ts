import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DocEntity,
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
  QnaEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  teamSlugNotFound,
  teamSlugTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { CreateTeamDto, UpdateTeamDto } from './dto';

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
    private readonly entityService: EntityService,
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
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    createTeamDto: CreateTeamDto,
    creator: OrgMemberEntity,
  ): Promise<TeamEntity> {
    const { name, slug, upToDateDuration } = createTeamDto;
    const { organization } = creator;
    const id = v4();
    const team = new TeamEntity(id, name, slug, upToDateDuration, creator);

    try {
      await this.em.persistAndFlush(team);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(teamSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.addDocs(
        organization.id,
        this.entityService.createTeamDocParams(team),
      );
    } catch (err) {
      this.logger.error(err);
      await this.em.removeAndFlush(team);
      throw new InternalServerErrorException(internalServerError);
    }

    return team;
  }

  /**
   * Whether a team with the given slug already exists within the organization.
   *
   * @param organization The organization to look in.
   * @param slug The slug to check for.
   *
   * @returns `true` if the slug already exists in the organization, `false` if not.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async hasOneBySlug(
    organization: OrganizationEntity,
    slug: string,
  ): Promise<boolean> {
    try {
      return !!(await this.em.findOne(TeamEntity, { organization, slug }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `TeamEntity` associated with the given slug and organization.
   *
   * @param organization The organization the team belongs to.
   * @param slug The slug to look for.
   *
   * @returns The associated `TeamEntity` instance.
   * @throws {NotFoundException} `teamSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneBySlug(
    organization: OrganizationEntity,
    slug: string,
  ): Promise<TeamEntity> {
    try {
      return await this.em.findOneOrFail(TeamEntity, {
        organization,
        slug,
      });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(teamSlugNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the given `TeamEntity` and saves the changes to the database.
   *
   * @param team The `TeamEntity` to update.
   * @param updateTeamDto The new details for the team.
   *
   * @returns The updated `TeamEntity` instance.
   * @throws {BadRequestException} `teamSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async update(
    team: TeamEntity,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamEntity> {
    const updatedTeam = this.em.assign(team, updateTeamDto);

    const { upToDateDuration } = updateTeamDto;
    const { docs, qnas } = await this.changeUpToDateDuration(
      team,
      upToDateDuration,
    );

    try {
      await this.em.flush();
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(teamSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = team.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(collectionName, [
        this.entityService.createTeamDocParams(updatedTeam),
        ...docs.map((doc) => this.entityService.createDocDocParams(doc)),
        ...qnas.map((qna) => this.entityService.createQnaDocParams(qna)),
      ]);
    } catch (err) {
      this.logger.error(err);
    }

    return updatedTeam;
  }

  /**
   * Deletes the given `TeamEntity` and saves the changes to the database.
   *
   * @param team The `TeamEntity` instance to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(team: TeamEntity): Promise<void> {
    const collectionName = team.organization.id;
    const { id } = team;
    await this.entityService.safeToDelete(team);

    try {
      await this.em.removeAndFlush(team);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.deleteDocs(collectionName, [
        { id },
        { query: `team:${id}` },
      ]);
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Helper function for changing the out-of-date datetimes for all child posts that use the team's duration value.
   *
   * @param team The team whose duration changed.
   * @param upToDateDuration The new value for the up-to-date duration as an ISO 8601 duration string.
   *
   * @returns All of the posts that were updated.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any error.
   */
  async changeUpToDateDuration(
    team: TeamEntity,
    upToDateDuration: string | null | undefined,
  ): Promise<{ docs: DocEntity[]; qnas: QnaEntity[] }> {
    if (
      upToDateDuration === undefined ||
      upToDateDuration === team.upToDateDuration
    ) {
      return { docs: [], qnas: [] };
    }

    try {
      const docs = await this.em.find(DocEntity, {
        team,
        upToDateDuration: null,
      });
      const qnas = await this.em.find(QnaEntity, {
        team,
        upToDateDuration: null,
      });

      const newDuration = dayjs.duration(
        upToDateDuration ?? team.organization.upToDateDuration,
      );
      [...docs, ...qnas].forEach((post) => {
        this.em.assign(post, {
          outOfDateAt: dayjs(post.markedUpToDateAt).add(newDuration).toDate(),
        });
      });

      return { docs, qnas };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
