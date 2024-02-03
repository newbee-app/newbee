import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CommonEntityFields } from '@newbee/shared/util';

/**
 * The abstract MikroORM entity representing a base common entity.
 */
@Entity({ abstract: true })
export abstract class CommonEntity implements CommonEntityFields {
  /**
   * The globally unique ID for the entity.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
  id: string;

  /**
   * @inheritdoc
   */
  @Property()
  createdAt: Date = new Date();

  /**
   * @inheritdoc
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = this.createdAt;

  constructor(id: string) {
    this.id = id;
  }
}
