import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKeyType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { OrgRoleEnum, translator } from '@newbee/api/shared/util';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing the link between users and thier organizations.
 * The org member's slug should be unique within the organization.
 */
@Entity()
@Unique<OrgMemberEntity>({ properties: ['organization', 'slug'] })
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
   * The user's unique slug within the organization.
   */
  @Property()
  slug: string = translator.new();

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
