import { Entity, Enum, ManyToOne, Unique } from '@mikro-orm/core';
import { TeamMember, TeamRoleEnum, ascTeamRoleEnum } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { CommonEntity } from './common.abstract.entity';
import { OrgMemberEntity } from './org-member.entity';
import { TeamEntity } from './team.entity';

/**
 * The MikroORM entity representing the link between org members and their teams.
 */
@Entity()
@Unique<TeamMemberEntity>({ properties: ['orgMember', 'team'] })
export class TeamMemberEntity extends CommonEntity implements TeamMember {
  /**
   * @inheritdoc
   */
  @Enum({
    items: () => TeamRoleEnum,
    customOrder: ascTeamRoleEnum,
  })
  role: TeamRoleEnum;

  /**
   * The org member associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrgMemberEntity, { hidden: true })
  orgMember: OrgMemberEntity;

  /**
   * The team associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => TeamEntity, { hidden: true })
  team: TeamEntity;

  constructor(
    orgMember: OrgMemberEntity,
    team: TeamEntity,
    role: TeamRoleEnum,
  ) {
    super(v4());

    this.orgMember = orgMember;
    this.team = team;
    this.role = role;
  }
}
