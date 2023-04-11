import { Entity, Enum, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';
import type { TeamMember } from '@newbee/shared/util';
import { TeamRoleEnum } from '@newbee/shared/util';
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
}
