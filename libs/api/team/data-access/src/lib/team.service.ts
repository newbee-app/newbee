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
  TeamEntity,
  UserOrganizationEntity,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  teamNameNotFound,
  teamNameTakenBadRequest,
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
   * Creates a new `TeamEntity` and associates it with its relevant `ResourceEntity`, `OrganizationEntity`, `RoleEntity`, and `GrantEntity`.
   *
   * @param createTeamDto The information needed to create a new team.
   * @param creator The `UserOrganizationEntity` that represents a user within the organization creating the team. The `organization` portion of the entity must be populated.
   *
   * @returns A new `TeamEntity` instance.
   * @throws {BadRequestException} `teamNameTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    createTeamDto: CreateTeamDto,
    creator: UserOrganizationEntity
  ): Promise<TeamEntity> {
    const { name, displayName } = createTeamDto;
    const team = new TeamEntity(name, displayName, creator);

    try {
      await this.teamRepository.persistAndFlush(team);
      return team;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(teamNameTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `TeamEntity` associated with the given name and organization.
   *
   * @param organization The organization the team belongs to.
   * @param name The name to look for.
   *
   * @returns The associated `TeamEntity` instance.
   * @throws {NotFoundException} `teamNameNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByName(
    organization: OrganizationEntity,
    name: string
  ): Promise<TeamEntity> {
    try {
      return await this.teamRepository.findOneOrFail({ organization, name });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(teamNameNotFound);
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
   * @throws {BadRequestException} `teamNameTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
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
        throw new BadRequestException(teamNameTakenBadRequest);
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
