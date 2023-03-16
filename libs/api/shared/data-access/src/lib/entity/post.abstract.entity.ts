import {
  Entity,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { shortenUuid } from '@newbee/api/shared/util';
import { Post } from '@newbee/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { TeamEntity } from './team.entity';

/**
 * The abstract MikroORM entity representing a `Post`.
 * Posts can be one of 2 entities: Doc or QnA.
 */
@Entity({ abstract: true })
@Unique<PostEntity>({ properties: ['slug', 'organization'] })
export abstract class PostEntity implements Post {
  /**
   * The globally unique ID for the post.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
  id: string;

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

  /**
   * @inheritdoc
   */
  @Property()
  title: string;

  /**
   * @inheritdoc
   */
  @Property()
  slug: string;

  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'markedUpToDateAt' | 'upToDate';

  /**
   * The organization associated with the post.
   * Should be `hidden`, so it will never be serialized.
   */
  abstract organization: OrganizationEntity;

  /**
   * The team associated with the post.
   * A post does not have to belong to a team, in which case it will just belong to the organization.
   * Should be `hidden`, so it will never be serialized.
   */
  abstract team: TeamEntity | null;

  /**
   * The org member that created the post.
   * Should be `hidden`, so it will never be serialized.
   */
  abstract creator: OrgMemberEntity;

  /**
   * The org member responsible for maintaining the post.
   * It can be null if the post is a qna that hasn't been answered yet.
   * Otherwise, there should aways be one (and only one) maintainer.
   * Should be `hidden`, so it will never be serialized.
   */
  abstract maintainer: OrgMemberEntity | null;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
    this.slug = shortenUuid(id);
  }
}
