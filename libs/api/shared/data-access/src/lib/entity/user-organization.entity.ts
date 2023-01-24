import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKeyType,
} from '@mikro-orm/core';
import { OrganizationEntity } from './organization.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing the link between users and thier organizations.
 * Also contains all of the roles the user holds within the organization.
 */
@Entity()
export class UserOrganizationEntity {
  /**
   * The user associated with this entity.
   */
  @ManyToOne(() => UserEntity, { primary: true })
  user: UserEntity;

  /**
   * The organization associated with this entity.
   */
  @ManyToOne(() => OrganizationEntity, { primary: true })
  organization: OrganizationEntity;

  /**
   * All of the roles the user holds, within the organization.
   */
  @ManyToMany(() => RoleEntity, (role) => role.users, { owner: true })
  roles = new Collection<RoleEntity>(this);

  /**
   * Specifies the primary key of the entity.
   * In this case, it's a composite primary key consisting of the foreign keys of `user` and `organization`.
   */
  [PrimaryKeyType]?: [string, string];

  constructor(user: UserEntity, organization: OrganizationEntity) {
    this.user = user;
    this.organization = organization;
  }
}
