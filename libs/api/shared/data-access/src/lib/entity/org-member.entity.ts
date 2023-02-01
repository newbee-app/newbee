import { Entity, Enum, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';
import { OrganizationRole } from '@newbee/api/shared/util';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing the link between users and thier organizations.
 */
@Entity()
export class OrgMemberEntity {
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
   * The user's role in the organization.
   */
  @Enum(() => OrganizationRole)
  role: OrganizationRole;

  /**
   * Specifies the primary key of the entity.
   * In this case, it's a composite primary key consisting of the foreign keys of `user` and `organization`.
   */
  [PrimaryKeyType]?: [string, string];

  constructor(
    user: UserEntity,
    organization: OrganizationEntity,
    role: OrganizationRole
  ) {
    this.user = user;
    this.organization = organization;
    this.role = role;
  }
}
