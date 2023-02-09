import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TeamRoleEnum } from '@newbee/api/shared/util';
import { Team } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { DocEntity } from './doc.entity';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { QnaEntity } from './qna.entity';
import { TeamMemberEntity } from './team-member.entity';

/**
 * The MikroORM entity representing a `Team`.
 * The team name should be unique for the organization.
 */
@Entity()
@Unique<TeamEntity>({ properties: ['name', 'organization'] })
export class TeamEntity implements Team {
  /**
   * The globally unique ID for the team.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
  id: string = v4();

  /**
   * @inheritdoc
   */
  @Property()
  name: string;

  /**
   * @inheritdoc
   */
  @Property({ nullable: true })
  displayName: string | null;

  /**
   * All of the docs that belong to the team.
   * `orphanRemoval` is on, so if the team is deleted, so is its docs.
   * Additionally, if a doc is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => DocEntity, (doc) => doc.team, {
    orphanRemoval: true,
    hidden: true,
  })
  docs = new Collection<DocEntity>(this);

  /**
   * All of the QnAs that belong to the team.
   * `orphanRemoval` is on, so if the team is deleted, so is its QnAs.
   * Additionally, if a QnA is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => QnaEntity, (qna) => qna.team, {
    orphanRemoval: true,
    hidden: true,
  })
  qnas = new Collection<QnaEntity>(this);

  /**
   * The organization the team belongs to.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrganizationEntity, { hidden: true })
  organization: OrganizationEntity;

  /**
   * All of the members of the team.
   * `orphanRemoval` is on, so if the team is deleted, so is its team member entities.
   * Additionally, if a team member is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => TeamMemberEntity, (teamMember) => teamMember.team, {
    orphanRemoval: true,
    hidden: true,
  })
  teamMembers = new Collection<TeamMemberEntity>(this);

  constructor(
    name: string,
    displayName: string | null,
    creator: OrgMemberEntity
  ) {
    this.name = name;
    this.displayName = displayName;
    this.organization = creator.organization;
    new TeamMemberEntity(creator, this, TeamRoleEnum.Owner);
  }
}
