import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { GrantEntity } from './grant.entity';
import { UserOrganizationEntity } from './user-oraganization.entity';

/**
 * The MikroORM entity representing a `Role`.
 */
@Entity()
export class RoleEntity {
  /**
   * The globally unique ID for the role.
   */
  @PrimaryKey()
  id = v4();

  /**
   * All of the other roles this role is a superset of.
   */
  @ManyToMany(() => RoleEntity)
  impliedRoles = new Collection<RoleEntity>(this);

  /**
   * All of the grants that reference this resource.
   * `orphanRemoval` is on, so if the role is deleted, so is its grants.
   * Additionally, if a grant is removed from the collection, it is also deleted.
   */
  @OneToMany(() => GrantEntity, (grant) => grant.role, {
    orphanRemoval: true,
  })
  grants = new Collection<GrantEntity>(this);

  /**
   * All of the users attached to this role.
   */
  @ManyToMany(() => UserOrganizationEntity, (user) => user.roles)
  users = new Collection<UserOrganizationEntity>(this);

  constructor(optional?: {
    impliedRoles?: RoleEntity[];
    users?: UserOrganizationEntity[];
  }) {
    if (!optional) {
      return;
    }

    const { impliedRoles, users } = optional;
    if (impliedRoles) {
      this.impliedRoles.add(impliedRoles);
    }
    if (users) {
      this.users.add(users);
    }
  }
}
