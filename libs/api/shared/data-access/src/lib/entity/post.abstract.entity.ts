import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Post } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
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
  id: string = v4();

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
   * The org member that created the post.
   */
  abstract creator: OrgMemberEntity;

  /**
   * The org member responsible for maintaining the post.
   * It can be null if the post is a qna that hasn't been answered yet.
   * Otherwise, there should aways be one (and only one) maintainer.
   */
  abstract maintainer: OrgMemberEntity | null;

  /**
   * @inheritdoc
   */
  abstract slug: string;
}
