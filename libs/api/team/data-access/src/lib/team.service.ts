import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  OrganizationEntity,
  OrgMemberEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import { generateUniqueSlug } from '@newbee/api/shared/util';
import {
  internalServerError,
  teamSlugNotFound,
  teamSlugTakenBadRequest,
} from '@newbee/shared/util';
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
    @InjectRepository(TeamEntity)
    private readonly teamRepository: EntityRepository<TeamEntity>
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
    creator: OrgMemberEntity
  ): Promise<TeamEntity> {
    const { name } = createTeamDto;
    let { slug } = createTeamDto;
    const { organization } = creator;
    if (!slug) {
      slug = await generateUniqueSlug(
        async (slugToTry) =>
          !(await this.hasOneBySlug(organization, slugToTry)),
        name
      );
    }
    const team = new TeamEntity(name, slug, creator);

    try {
      await this.teamRepository.persistAndFlush(team);
      return team;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(teamSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Whether a team with the given slug already exists within the organization.
   *
   * @param organization The organization to look in.
   * @param slug The slug to check for.
   *
   * @returns `true` if the slug already exists in the organization, `false` if not.
   */
  async hasOneBySlug(
    organization: OrganizationEntity,
    slug: string
  ): Promise<boolean> {
    return !!(await this.teamRepository.findOne({ organization, slug }));
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
    slug: string
  ): Promise<TeamEntity> {
    try {
      return await this.teamRepository.findOneOrFail({
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
    updateTeamDto: UpdateTeamDto
  ): Promise<TeamEntity> {
    const updatedTeam = this.teamRepository.assign(team, updateTeamDto);
    try {
      await this.teamRepository.flush();
      return updatedTeam;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(teamSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given `TeamEntity` and saves the changes to the database.
   *
   * @param team The `TeamEntity` instance to delete.
   */
  async delete(team: TeamEntity): Promise<void> {
    await this.teamRepository.removeAndFlush(team);
  }
}
