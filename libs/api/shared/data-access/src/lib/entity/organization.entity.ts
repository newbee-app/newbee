import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import type { Organization } from '@newbee/shared/util';
import { OrgRoleEnum } from '@newbee/shared/util';
import slugify from 'slug';
import { CommonEntity } from './common.abstract.entity';
import { DocEntity } from './doc.entity';
import { OrgMemberInviteEntity } from './org-member-invite.entity';
import { OrgMemberEntity } from './org-member.entity';
import { QnaEntity } from './qna.entity';
import { TeamEntity } from './team.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing an `Organization`.
 */
@Entity()
export class OrganizationEntity extends CommonEntity implements Organization {
  /**
   * @inheritdoc
   */
  @Property()
  name: string;

  /**
   * @inheritdoc
   */
  @Property({ unique: true })
  slug: string;

  /**
   * @inheritdoc
   */
  @Property({ length: 50 })
  upToDateDuration: string;

  /**
   * When the Solr suggester for the org was last built.
   * Used to help determine whether the org's suggester should be built, which should only happen once per day.
   * `hidden` is on, so it will never be serialized.
   */
  @Property({ hidden: true })
  suggesterBuiltAt: Date = new Date();

  /**
   * All of the teams that belong to the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its teams.
   * Additionally, if a team is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => TeamEntity, (team) => team.organization, {
    orphanRemoval: true,
    hidden: true,
  })
  teams = new Collection<TeamEntity>(this);

  /**
   * All of the docs that belong to the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its docs.
   * Additionally, if a doc is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => DocEntity, (doc) => doc.organization, {
    orphanRemoval: true,
    hidden: true,
  })
  docs = new Collection<DocEntity>(this);

  /**
   * All of the QnAs that belong to the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its QnAs.
   * Additionally, if a QnA is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => QnaEntity, (qna) => qna.organization, {
    orphanRemoval: true,
    hidden: true,
  })
  qnas = new Collection<QnaEntity>(this);

  /**
   * All of the members of the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its org member entities.
   * Additionally, if a org member is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => OrgMemberEntity, (user) => user.organization, {
    orphanRemoval: true,
    hidden: true,
  })
  members = new Collection<OrgMemberEntity>(this);

  /**
   * All of the outstanding invites for users to join the organization.
   */
  @OneToMany(() => OrgMemberInviteEntity, (invite) => invite.organization, {
    orphanRemoval: true,
    hidden: true,
  })
  invites = new Collection<OrgMemberInviteEntity>(this);

  constructor(
    id: string,
    name: string,
    slug: string,
    upToDateDuration: string,
    creator: UserEntity,
  ) {
    super(id);

    this.name = name;
    this.slug = slugify(slug);
    this.upToDateDuration = upToDateDuration;
    new OrgMemberEntity(creator, this, OrgRoleEnum.Owner);
  }
}
