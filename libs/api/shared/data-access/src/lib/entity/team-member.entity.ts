import { Entity, Enum, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';
import {
  cannotDeleteOnlyTeamOwnerBadRequest,
  TeamMember,
  TeamRoleEnum,
} from '@newbee/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { TeamEntity } from './team.entity';

/**
 * The MikroORM entity representing the link between org members and their teams.
 */
@Entity()
export class TeamMemberEntity implements TeamMember {
  /**
   * The org member associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrgMemberEntity, { primary: true, hidden: true })
  orgMember: OrgMemberEntity;

  /**
   * The team associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => TeamEntity, { primary: true, hidden: true })
  team: TeamEntity;

  /**
   * @inheritdoc
   */
  @Enum(() => TeamRoleEnum)
  role: TeamRoleEnum;

  /**
   * Specifies the primary key of the entity.
   * In this case, it's a composite primary key consisting of the foreign keys of `orgMember` and `team`.
   */
  [PrimaryKeyType]?: [string, string];

  constructor(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
    role: TeamRoleEnum
  ) {
    this.orgMember = orgMember;
    this.team = team;
    this.role = role;
  }

  /**
   * Checks whether this instance of TeamMemberEntity is safe to delete and throws a `BadRequestionException` if it's not.
   * If the team member is the only owner of the team, it's not safe to delete.
   * Otherwise, it is safe to delete.
   *
   * @param em The entity manager to use to find all owners of this team member's team.
   *
   * @throws {BadRequestException} `cannotDeleteOnlyTeamOwnerBadRequest`. If the team member is the only owner of the team.
   * @throws {Error} Any of the errors that `find` can throw.
   */
  async safeToDelete(em: EntityManager): Promise<void> {
    if (this.role !== TeamRoleEnum.Owner) {
      return;
    }

    const owners = await em.find(TeamMemberEntity, {
      role: TeamRoleEnum.Owner,
      team: this.team,
    });
    if (owners.length === 1) {
      throw new BadRequestException(cannotDeleteOnlyTeamOwnerBadRequest);
    }
  }
}
