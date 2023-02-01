import { Entity, Enum, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';
import { TeamRole } from '@newbee/api/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { TeamEntity } from './team.entity';

/**
 * The MikroORM entity representing the link between org members and their teams.
 */
@Entity()
export class TeamMemberEntity {
  /**
   * The org member associated with this entity.
   */
  @ManyToOne(() => OrgMemberEntity, { primary: true })
  orgMember: OrgMemberEntity;

  /**
   * The team associated with this entity.
   */
  @ManyToOne(() => TeamEntity, { primary: true })
  team: TeamEntity;

  /**
   * The org member's role in the team.
   */
  @Enum(() => TeamRole)
  role: TeamRole;

  /**
   * Specifies the primary key of the entity.
   * In this case, it's a composite primary key consisting of the foreign keys of `orgMember` and `team`.
   */
  [PrimaryKeyType]?: [string, string];

  constructor(orgMember: OrgMemberEntity, team: TeamEntity, role: TeamRole) {
    this.orgMember = orgMember;
    this.team = team;
    this.role = role;
  }
}
