import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CRUD, Possession } from '@newbee/api/shared/util';
import type { Organization } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { DocEntity } from './doc.entity';
import { GrantEntity } from './grant.entity';
import { QnaEntity } from './qna.entity';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';
import { TeamEntity } from './team.entity';
import { UserOrganizationEntity } from './user-organization.entity';
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
   * The organization represented as a generic resource.
   * All actions are cascaded, so if the organization is deleted, so is its associated resource.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToOne(() => ResourceEntity, (resource) => resource.organization, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  resource = new ResourceEntity(this);

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
   * `orphanRemoval` is on, so if the organization is deleted, so is its user organization entities.
   * Additionally, if a user organization is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => UserOrganizationEntity, (user) => user.organization, {
    orphanRemoval: true,
    hidden: true,
  })
  users = new Collection<UserOrganizationEntity>(this);

  /**
   * All of the properties of the entity that are optional.
   * In this case, it's `resource`.
   */
  [OptionalProps]?: 'resource';

  constructor(name: string, displayName: string | null, creator: UserEntity) {
    this.name = name;
    this.displayName = displayName;
    const user = new UserOrganizationEntity(creator, this);

    const member = new RoleEntity();
    this.generateMemberGrants(member);
    const admin = new RoleEntity({ impliedRoles: [member] });
    this.generateAdminGrants(admin);
    const owner = new RoleEntity({
      impliedRoles: [member, admin],
      users: [user],
    });
    this.generateOwnerGrants(owner);
  }

  /**
   * A helper function for generating the grants associated with the organization member role.
   * @param member The member `RoleEntity`.
   */
  private generateMemberGrants(member: RoleEntity): void {
    // A member can create docs and QnAs
    new GrantEntity(member, this.resource, CRUD.C, Possession.Any, [
      'docs',
      'qnas',
    ]);

    // A member can read any property, except ID and resource (no need for this to be visible to the user)
    new GrantEntity(member, this.resource, CRUD.R, Possession.Any, [
      '*',
      '!id',
      '!resource',
    ]);
  }

  /**
   * A helper function for generating the grants associated with the organization admin role.
   * @param admin The admin `RoleEntity`.
   */
  private generateAdminGrants(admin: RoleEntity): void {
    // Admins can create teams and add new users to the org
    new GrantEntity(admin, this.resource, CRUD.C, Possession.Any, [
      'teams',
      'users',
    ]);

    // Admins can update any property of the org, except the ID and resource
    new GrantEntity(admin, this.resource, CRUD.U, Possession.Any, [
      '*',
      '!id',
      '!resource',
    ]);

    // Admins can delete teams, docs, QnAs, and remove users
    new GrantEntity(admin, this.resource, CRUD.D, Possession.Any, [
      'teams',
      'docs',
      'qnas',
      'users',
    ]);
  }

  /**
   * A helper function for generating the grants associated with the organization owner role.
   * @param owner The owner `RoleEntity`.
   */
  private generateOwnerGrants(owner: RoleEntity): void {
    // Owners can delete the organization itself (being able to delete the primary key implies being able to delete the organization)
    new GrantEntity(owner, this.resource, CRUD.D, Possession.Any, ['*']);
  }
}
