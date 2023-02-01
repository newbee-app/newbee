import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { OrganizationRole } from '@newbee/api/shared/util';
import type { Organization } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { DocEntity } from './doc.entity';
import { OrgMemberEntity } from './org-member.entity';
import { QnaEntity } from './qna.entity';
import { TeamEntity } from './team.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing an `Organization`.
 */
@Entity()
export class OrganizationEntity implements Organization {
  /**
   * The globally unique ID for the organization.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
  id = v4();

  /**
   * @inheritdoc
   */
  @Property({ unique: true })
  name: string;

  /**
   * @inheritdoc
   */
  @Property({ nullable: true })
  displayName: string | null;

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

  constructor(name: string, displayName: string | null, creator: UserEntity) {
    this.name = name;
    this.displayName = displayName;
    new OrgMemberEntity(creator, this, OrganizationRole.Owner);
  }
}
