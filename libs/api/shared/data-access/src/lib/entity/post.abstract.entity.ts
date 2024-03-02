import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { shortenUuid } from '@newbee/api/shared/util';
import { type Post } from '@newbee/shared/util';
import dayjs from 'dayjs';
import { CommonEntity } from './common.abstract.entity';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { TeamEntity } from './team.entity';

/**
 * The abstract MikroORM entity representing a `Post`.
 * Posts can be one of 2 entities: Doc or QnA.
 */
@Entity({ abstract: true })
@Unique<PostEntity>({ properties: ['slug', 'organization'] })
export abstract class PostEntity extends CommonEntity implements Post {
  /**
   * @inheritdoc
   */
  @Property()
  markedUpToDateAt: Date = this.createdAt;

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

  /**
   * @inheritdoc
   */
  @Property({ nullable: true, length: 50 })
  upToDateDuration: string | null;

  /**
   * @inheritdoc
   */
  @Property()
  @Index()
  outOfDateAt: Date;

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
   * It can be null if the creator of the post has left the organization.
   * Should be `hidden`, so it will never be serialized.
   */
  abstract creator: OrgMemberEntity | null;

  /**
   * The org member responsible for maintaining the post.
   * It can be null if the post is a qna that hasn't been answered yet.
   * Otherwise, there should aways be one (and only one) maintainer.
   * Should be `hidden`, so it will never be serialized.
   */
  abstract maintainer: OrgMemberEntity | null;

  constructor(
    title: string,
    upToDateDuration: string | null,
    team: TeamEntity | null,
    creator: OrgMemberEntity,
  ) {
    super();

    this.title = title;
    this.slug = shortenUuid(this.id);
    this.upToDateDuration = upToDateDuration;
    this.outOfDateAt = dayjs(this.createdAt)
      .add(
        dayjs.duration(
          upToDateDuration ??
            team?.upToDateDuration ??
            creator.organization.upToDateDuration,
        ),
      )
      .toDate();
  }
}
