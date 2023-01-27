import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Post } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { OrganizationEntity } from './organization.entity';
import { ResourceEntity } from './resource.entity';
import { TeamEntity } from './team.entity';

/**
 * The abstract MikroORM entity representing a `Post`.
 * Posts can be one of 2 entities: Doc or QnA
 */
@Entity({ abstract: true })
export abstract class PostEntity implements Post {
  /**
   * The globally unique ID for the post.
   */
  @PrimaryKey()
  id = v4();

  /**
   * @inheritdoc
   */
  @Property({ type: 'datetime' })
  createdAt = new Date();

  /**
   * @inheritdoc
   */
  @Property({ type: 'datetime' })
  updatedAt = this.createdAt;

  /**
   * @inheritdoc
   */
  @Property({ type: 'datetime' })
  markedUpToDateAt = this.createdAt;

  /**
   * @inheritdoc
   */
  @Property({ type: 'boolean' })
  upToDate = true;

  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'markedUpToDateAt' | 'upToDate';

  /**
   * The organization associated with the post.
   */
  abstract organization: OrganizationEntity;

  /**
   * The team associated with the post.
   * A post does not have to belong to a team, in which case it will just belong to the organization.
   */
  abstract team: TeamEntity | null;

  /**
   * @inheritdoc
   */
  abstract slug: string;

  /**
   * The post represented as a generic resource.
   * All actions are cascaded, so if the post is deleted, so is its associated resource.
   */
  abstract resource: ResourceEntity;
}
