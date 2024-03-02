import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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
  forbiddenError,
  generateLteTeamRoles,
  teamMemberNotFound,
  userAlreadyTeamMemberBadRequest,
} from '@newbee/shared/util';

/**
 * The service that interacts with `TeamMemberEntity`.
 */
@Injectable()
export class TeamMemberService {
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
   */
  async create(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
    role: TeamRoleEnum,
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
  ): Promise<TeamMemberEntity> {
    TeamMemberService.checkRequesterTeamRole(
      requesterOrgRole,
      requesterTeamRole,
      role,
    );

    const teamMember = new TeamMemberEntity(orgMember, team, role);
    try {
      await this.em.persistAndFlush(teamMember);
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        this.logger.error(err);
        throw new BadRequestException(userAlreadyTeamMemberBadRequest);
      }

      throw err;
    }
    return teamMember;
  }

  /**
   * Finds the team member associated with the given org member and team.
   *
   * @param orgMember The org member to search for.
   * @param team The team to search in.
   *
   * @returns The associated team member instance.
   * @throws {NotFoundException} `teamMemberNotFound`. If the team member cannot be found.
   */
  async findOneByTeamAndOrgMember(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
  ): Promise<TeamMemberEntity> {
    const teamMember = await this.em.findOne(TeamMemberEntity, {
      orgMember,
      team,
    });
    if (!teamMember) {
      throw new NotFoundException(teamMemberNotFound);
    }
    return teamMember;
  }

  /**
   * Finds the team member associated with the given org member and team.
   * Returns null if none exist.
   *
   * @param orgMember The org member to search for.
   * @param team The team to search in.
   *
   * @returns The associated team member instance or null.
   */
  async findOneByTeamAndOrgMemberOrNull(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
  ): Promise<TeamMemberEntity | null> {
    return await this.em.findOne(TeamMemberEntity, { orgMember, team });
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
   */
  async updateRole(
    teamMember: TeamMemberEntity,
    newRole: TeamRoleEnum,
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
  ): Promise<TeamMemberEntity> {
    TeamMemberService.checkRequesterTeamRole(
      requesterOrgRole,
      requesterTeamRole,
      newRole,
    );

    teamMember = this.em.assign(teamMember, {
      role: newRole,
    });
    await this.em.flush();
    return teamMember;
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
   */
  async delete(
    teamMember: TeamMemberEntity,
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
  ): Promise<void> {
    TeamMemberService.checkRequesterTeamRole(
      requesterOrgRole,
      requesterTeamRole,
      teamMember.role,
    );
    await this.entityService.safeToDelete(teamMember);
    await this.em.removeAndFlush(teamMember);
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
  static checkRequesterTeamRole(
    requesterOrgRole: OrgRoleEnum,
    requesterTeamRole: TeamRoleEnum | null,
    subjectRole: TeamRoleEnum,
  ): void {
    if (
      generateLteTeamRoles(requesterOrgRole, requesterTeamRole).includes(
        subjectRole,
      )
    ) {
      return;
    }

    throw new ForbiddenException(forbiddenError);
  }
}
