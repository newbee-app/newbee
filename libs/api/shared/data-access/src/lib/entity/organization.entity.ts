import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CRUD, Possession } from '@newbee/api/shared/util';
import { v4 } from 'uuid';
import { DocEntity } from './doc.entity';
import { GrantEntity } from './grant.entity';
import { QnAEntity } from './qna.entity';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';
import { TeamEntity } from './team.entity';
import { UserOrganizationEntity } from './user-oraganization.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing an `Organization`.
 */
@Entity()
export class OrganizationEntity {
  /**
   * The globally unique ID for the organization.
   */
  @PrimaryKey()
  id = v4();

  /**
   * The globally unique name for the organization.
   */
  @Property({ unique: true })
  name!: string;

  /**
   * How to display the name of the organization in the app, regardless of the value of `name`.
   */
  @Property({ nullable: true })
  displayName: string | null = null;

  /**
   * The organization represented as a generic resource.
   * All actions are cascaded, so if the organization is deleted, so is its associated resource.
   */
  @OneToOne(() => ResourceEntity, (resource) => resource.organization, {
    cascade: [Cascade.ALL],
  })
  resource = new ResourceEntity(this);

  /**
   * All of the teams that belong to the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its teams.
   * Additionally, if a team is removed from the collection, it is also deleted.
   */
  @OneToMany(() => TeamEntity, (team) => team.organization, {
    orphanRemoval: true,
  })
  teams = new Collection<TeamEntity>(this);

  /**
   * All of the docs that belong to the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its docs.
   * Additionally, if a doc is removed from the collection, it is also deleted.
   */
  @OneToMany(() => DocEntity, (doc) => doc.organization, {
    orphanRemoval: true,
  })
  docs = new Collection<DocEntity>(this);

  /**
   * All of the QnAs that belong to the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its QnAs.
   * Additionally, if a QnA is removed from the collection, it is also deleted.
   */
  @OneToMany(() => QnAEntity, (qna) => qna.organization, {
    orphanRemoval: true,
  })
  qnas = new Collection<QnAEntity>(this);

  /**
   * All of the members of the organization.
   * `orphanRemoval` is on, so if the organization is deleted, so is its user organization entities.
   * Additionally, if a user organization is removed from the collection, it is also deleted.
   */
  @OneToMany(() => UserOrganizationEntity, (user) => user.organization, {
    orphanRemoval: true,
  })
  users = new Collection<UserOrganizationEntity>(this);

  constructor(
    name: string,
    creator: UserEntity,
    optional?: { displayName?: string }
  ) {
    this.name = name;

    const user = new UserOrganizationEntity(creator, this);
    this.users.add(user);

    const member = new RoleEntity();
    this.generateMemberGrants(member);
    const admin = new RoleEntity({ impliedRoles: [member] });
    this.generateAdminGrants(admin);
    const owner = new RoleEntity({
      impliedRoles: [member, admin],
      users: [user],
    });
    this.generateOwnerGrants(owner);

    if (!optional) {
      return;
    }

    const { displayName } = optional;
    if (displayName) {
      this.displayName = displayName;
    }
  }

  /**
   * A helper function for generating the grants associated with the organization member role.
   * @param member The member `RoleEntity`.
   */
  private generateMemberGrants(member: RoleEntity): void {
    const grants = [
      // A member can create docs and QnAs
      new GrantEntity(member, this.resource, CRUD.C, Possession.Any, [
        'docs',
        'qnas',
      ]),
      // A member can read any property, except ID and resource (no need for this to be visible to the user)
      new GrantEntity(member, this.resource, CRUD.R, Possession.Any, [
        '*',
        '!id',
        '!resource',
      ]),
    ];
    this.resource.grants.add(grants);
  }

  /**
   * A helper function for generating the grants associated with the organization admin role.
   * @param admin The admin `RoleEntity`.
   */
  private generateAdminGrants(admin: RoleEntity): void {
    const grants = [
      // Admins can create teams and add new users to the org
      new GrantEntity(admin, this.resource, CRUD.C, Possession.Any, [
        'teams',
        'users',
      ]),
      // Admins can update any property of the org, except the ID and resource
      new GrantEntity(admin, this.resource, CRUD.U, Possession.Any, [
        '*',
        '!id',
        '!resource',
      ]),
      // Admins can delete teams, docs, QnAs, and remove users
      new GrantEntity(admin, this.resource, CRUD.D, Possession.Any, [
        'teams',
        'docs',
        'qnas',
        'users',
      ]),
    ];
    this.resource.grants.add(grants);
  }

  /**
   * A helper function for generating the grants associated with the organization owner role.
   * @param owner The owner `RoleEntity`.
   */
  private generateOwnerGrants(owner: RoleEntity): void {
    const grants = [
      // Owners can delete the organization itself (being able to delete the primary key implies being able to delete the organization)
      new GrantEntity(owner, this.resource, CRUD.D, Possession.Any, ['*']),
    ];
    this.resource.grants.add(grants);
  }
}
