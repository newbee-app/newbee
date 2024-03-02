import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import type { Team } from '@newbee/shared/util';
import { TeamRoleEnum } from '@newbee/shared/util';
import slugify from 'slug';
import { CommonEntity } from './common.abstract.entity';
import { DocEntity } from './doc.entity';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { QnaEntity } from './qna.entity';
import { TeamMemberEntity } from './team-member.entity';

/**
 * The MikroORM entity representing a `Team`.
 * The team slug should be unique for the organization.
 */
@Entity()
@Unique<TeamEntity>({ properties: ['slug', 'organization'] })
export class TeamEntity extends CommonEntity implements Team {
  /**
   * @inheritdoc
   */
  @Property()
  name: string;

  /**
   * @inheritdoc
   */
  @Property()
  slug: string;

  /**
   * @inheritdoc
   */
  @Property({ nullable: true, length: 50 })
  upToDateDuration: string | null;

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
    slug: string,
    upToDateDuration: string | null,
    creator: OrgMemberEntity,
  ) {
    super();

    this.name = name;
    this.slug = slugify(slug);
    this.upToDateDuration = upToDateDuration;
    this.organization = creator.organization;
    new TeamMemberEntity(creator, this, TeamRoleEnum.Owner);
  }
}
