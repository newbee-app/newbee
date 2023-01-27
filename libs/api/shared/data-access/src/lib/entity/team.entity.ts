import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CRUD, Possession } from '@newbee/api/shared/util';
import { Team } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { DocEntity } from './doc.entity';
import { GrantEntity } from './grant.entity';
import { OrganizationEntity } from './organization.entity';
import { QnaEntity } from './qna.entity';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';
import { UserOrganizationEntity } from './user-organization.entity';

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
  id = v4();

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
   * The team represented as a generic resource.
   * All actions are cascaded, so if the team is deleted, so is its associated resource.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToOne(() => ResourceEntity, (resource) => resource.team, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  resource = new ResourceEntity(this);

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

  constructor(
    name: string,
    displayName: string | null,
    creator: UserOrganizationEntity
  ) {
    this.name = name;
    this.displayName = displayName;
    this.organization = creator.organization;

    const member = new RoleEntity();
    this.generateMemberGrants(member);
    const admin = new RoleEntity({ impliedRoles: [member] });
    this.generateAdminGrants(admin);
    const owner = new RoleEntity({
      impliedRoles: [member, admin],
      users: [creator],
    });
    this.generateOwnerGrants(owner);
  }

  /**
   * A helper function for generating the grants associated with the team member role.
   * @param member The member `RoleEntity`.
   */
  private generateMemberGrants(member: RoleEntity): void {
    // A member can create docs and QnAs
    new GrantEntity(member, this.resource, CRUD.C, Possession.Any, [
      'docs',
      'qnas',
    ]);

    // A member can read any property, except the ID and resource (no need for this to be visible to the user)
    new GrantEntity(member, this.resource, CRUD.R, Possession.Any, [
      '*',
      '!id',
      '!resource',
    ]);
  }

  /**
   * A helper function for generating the grants associated with the team admin role.
   * @param admin The admin `RoleEntity`.
   */
  private generateAdminGrants(admin: RoleEntity): void {
    // An admin can add new users to the team
    new GrantEntity(admin, this.resource, CRUD.C, Possession.Any, ['users']);

    // An admin can update any property of the team, except the ID, resource, and the organization it belongs to
    new GrantEntity(admin, this.resource, CRUD.U, Possession.Any, [
      '*',
      '!id',
      '!resource',
      '!organization',
    ]);

    // An admin can delete docs, QnAs, and remove users
    new GrantEntity(admin, this.resource, CRUD.D, Possession.Any, [
      'docs',
      'qnas',
      'users',
    ]);
  }

  /**
   * A helper function for generating the grants associated with the team owner role.
   * @param owner The owner `RoleEntity`.
   */
  private generateOwnerGrants(owner: RoleEntity): void {
    // Owners can delete the team itself (being able to delete the primary key implies being able to delete the team)
    new GrantEntity(owner, this.resource, CRUD.D, Possession.Any, ['*']);
  }
}
