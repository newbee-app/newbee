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
  OrgMemberEntity,
  TeamEntity,
  TeamMemberEntity,
} from '@newbee/api/shared/data-access';
import { TeamRole } from '@newbee/api/shared/util';
import {
  internalServerError,
  teamMemberNotFound,
  userAlreadyTeamMemberBadRequest,
} from '@newbee/shared/util';

/**
 * The service that interacts with `TeamMemberEntity`.
 */
@Injectable()
export class TeamMemberService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(TeamMemberService.name);

  constructor(
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: EntityRepository<TeamMemberEntity>
  ) {}

  /**
   * Creates a new team member using the given org member, team, and role.
   *
   * @param orgMember The org member to associate.
   * @param team The team to associate.
   * @param role The role the org member will have in the team.
   *
   * @returns A new team member instance.
   * @throws {BadRequestException} `userAlreadyTeamMemberBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
    role: TeamRole
  ): Promise<TeamMemberEntity> {
    const teamMember = new TeamMemberEntity(orgMember, team, role);
    try {
      await this.teamMemberRepository.persistAndFlush(teamMember);
      return teamMember;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userAlreadyTeamMemberBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the team member associated with the given org member and team.
   *
   * @param orgMember The org member to search for.
   * @param team The team to search in.
   *
   * @returns The associated team member instance.
   * @throws {NotFoundException} `teamMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByOrgMemberAndTeam(
    orgMember: OrgMemberEntity,
    team: TeamEntity
  ): Promise<TeamMemberEntity> {
    try {
      return await this.teamMemberRepository.findOneOrFail({ orgMember, team });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(teamMemberNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the role of the given team member.
   *
   * @param teamMember The team member to update.
   * @param newRole The new role for the team member.
   *
   * @returns The updated team member.
   */
  async updateRole(
    teamMember: TeamMemberEntity,
    newRole: TeamRole
  ): Promise<TeamMemberEntity> {
    const updatedTeamMember = this.teamMemberRepository.assign(teamMember, {
      role: newRole,
    });
    await this.teamMemberRepository.flush();
    return updatedTeamMember;
  }

  /**
   * Deletes the given team member.
   *
   * @param teamMember The team member to delete.
   */
  async delete(teamMember: TeamMemberEntity): Promise<void> {
    await this.teamMemberRepository.removeAndFlush(teamMember);
  }
}
