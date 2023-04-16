import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import type { Organization } from '@newbee/shared/util';
import { OrgRoleEnum } from '@newbee/shared/util';
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
export class OrganizationEntity implements Organization {
  /**
   * The globally unique ID for the organization.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
  id: string;

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

  constructor(id: string, name: string, slug: string, creator: UserEntity) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    new OrgMemberEntity(creator, this, OrgRoleEnum.Owner);
  }

  /**
   * Call `removeAll` on all of the entity's collections.
   * If necessary, call remove all on the individual entities of a collection.
   */
  async removeAllCollections(): Promise<void> {
    const collections = [this.teams, this.docs, this.qnas, this.members];
    for (const collection of collections) {
      if (!collection.isInitialized()) {
        await collection.init();
      }
    }

    for (const team of this.teams) {
      await team.removeAllCollections();
    }

    for (const collection of collections) {
      collection.removeAll();
    }
  }
}
