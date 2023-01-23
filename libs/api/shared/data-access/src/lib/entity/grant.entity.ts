import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CRUD, Possession } from '@newbee/api/shared/util';
import { v4 } from 'uuid';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';

/**
 * A MikroORM representing an `accesscontrol` grant.
 * A grant allows a `role` to commit an `action` of type `possession` on the `attributes` of a `resource`.
 * The combination of those properties should be unique.
 */
@Entity()
@Unique<GrantEntity>({
  properties: ['role', 'resource', 'action', 'possession', 'attributes'],
})
export class GrantEntity {
  /**
   * The globally unique ID for the grant.
   */
  @PrimaryKey()
  id = v4();

  /**
   * The role associated with the grant.
   */
  @ManyToOne(() => RoleEntity)
  role: RoleEntity;

  /**
   * The resource associated with the grant.
   */
  @ManyToOne(() => ResourceEntity)
  resource: ResourceEntity;

  /**
   * The CRUD action associated with the grant.
   */
  @Enum(() => CRUD)
  action: CRUD;

  /**
   * The possessional level associated with the grant.
   */
  @Enum(() => Possession)
  possession: Possession;

  /**
   * The attributes of the resource associated with the grant.
   */
  @Property({ type: 'array', nullable: true })
  attributes: string[];

  constructor(
    role: RoleEntity,
    resource: ResourceEntity,
    action: CRUD,
    possession: Possession,
    attributes: string[]
  ) {
    this.role = role;
    this.resource = resource;
    this.action = action;
    this.possession = possession;
    this.attributes = attributes;
  }
}
