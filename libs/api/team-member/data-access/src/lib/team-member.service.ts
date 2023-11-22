import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityService,
  OrgMemberEntity,
  TeamEntity,
  TeamMemberEntity,
} from '@newbee/api/shared/data-access';
import {
  OrgRoleEnum,
  TeamRoleEnum,
  compareTeamRoles,
  forbiddenError,
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
    private readonly em: EntityManager,
    private readonly entityService: EntityService,
  ) {}

  /**
   * Creates a new team member using the given org member, team, and role.
   *
   * @param orgMember The org member to associate.
   * @param team The team to associate.
   * @param role The role the org member will have in the team.
   * @param requesterOrgRole The org role of the requester.
   * @param requesterTeamRole The team role of the requester, if applicable.
   *
   * @returns A new team member instance.
   * @throws {ForbiddenException} `forbiddenError`. If the user is trying to create a team member with permissions that exceed their own.
   * @throws {BadRequestException} `userAlreadyTeamMemberBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
    role: TeamRoleEnum,
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
  ): Promise<TeamMemberEntity> {
    this.checkRequester(requesterOrgRole, requesterTeamRole, role);

    const teamMember = new TeamMemberEntity(orgMember, team, role);
    try {
      await this.em.persistAndFlush(teamMember);
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
    team: TeamEntity,
  ): Promise<TeamMemberEntity> {
    try {
      return await this.em.findOneOrFail(TeamMemberEntity, { orgMember, team });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(teamMemberNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the team member associated with the given org member and team.
   * Returns null if none exist.
   *
   * @param orgMember The org member to search for.
   * @param team The team to search in.
   *
   * @returns The associated team member instance or null.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByOrgMemberAndTeamOrNull(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
  ): Promise<TeamMemberEntity | null> {
    try {
      return await this.em.findOne(TeamMemberEntity, { orgMember, team });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the role of the given team member.
   *
   * @param teamMember The team member to update.
   * @param newRole The new role for the team member.
   * @param requesterOrgRole The org role of the requester.
   * @param requesterTeamRole The team role of the requester, if applicable.
   *
   * @returns The updated team member.
   * @throws {ForbiddenException} `forbiddenError`. If the user is trying to update a team member with permissions that exceed their own.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async updateRole(
    teamMember: TeamMemberEntity,
    newRole: TeamRoleEnum,
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
  ): Promise<TeamMemberEntity> {
    this.checkRequester(requesterOrgRole, requesterTeamRole, newRole);
    this.checkRequester(requesterOrgRole, requesterTeamRole, teamMember.role);

    const updatedTeamMember = this.em.assign(teamMember, {
      role: newRole,
    });
    try {
      await this.em.flush();
      return updatedTeamMember;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given team member.
   * If the team member is the only owner of the team, throw a `BadRequestException`.
   *
   * @param teamMember The team member to delete.
   * @param requesterOrgRole The org role of the requester.
   * @param requesterTeamRole The team role of the requester, if applicable.
   *
   * @throws {ForbiddenException} `forbiddenError`. If the user is trying to delete a team member with permissions that exceed their own.
   * @throws {BadRequestException} `cannotDeleteOnlyOwnerBadRequest`. If the team member is the only owner of the team.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(
    teamMember: TeamMemberEntity,
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
  ): Promise<void> {
    this.checkRequester(requesterOrgRole, requesterTeamRole, teamMember.role);

    await this.entityService.safeToDelete(teamMember);
    try {
      await this.em.removeAndFlush(teamMember);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Check the requester's roles to see if the operation is permissible.
   * The requester shouldn't be allowed to affect a role higher than theirs.
   *
   * @param requesterOrgRole The requester's org role.
   * @param requesterTeamRole The requester's team role, which can be null as their org role might be enough.
   * @param subjectRole The affected role.
   *
   * @throws {ForbiddenException} `forbiddenError`. If the operation isn't permissible.
   */
  checkRequester(
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
    subjectRole: TeamRoleEnum,
  ): void {
    if (
      requesterOrgRole === OrgRoleEnum.Moderator ||
      requesterOrgRole === OrgRoleEnum.Owner
    ) {
      return;
    }

    if (!requesterTeamRole) {
      throw new ForbiddenException(forbiddenError);
    }

    if (compareTeamRoles(requesterTeamRole, subjectRole) >= 0) {
      return;
    }

    throw new ForbiddenException(forbiddenError);
  }
}
