import { Entity, Enum, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';
import { OrgRoleEnum } from '@newbee/api/shared/util';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing the link between users and thier organizations.
 */
@Entity()
export class OrgMemberEntity {
  /**
   * The user associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => UserEntity, { primary: true, hidden: true })
  user: UserEntity;

  /**
   * The organization associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrganizationEntity, { primary: true, hidden: true })
  organization: OrganizationEntity;

  /**
   * The user's role in the organization.
   */
  @Enum(() => OrgRoleEnum)
  role: OrgRoleEnum;

  /**
   * Specifies the primary key of the entity.
   * In this case, it's a composite primary key consisting of the foreign keys of `user` and `organization`.
   */
  [PrimaryKeyType]?: [string, string];

  constructor(
    user: UserEntity,
    organization: OrganizationEntity,
    role: OrgRoleEnum
  ) {
    this.user = user;
    this.organization = organization;
    this.role = role;
  }
}
