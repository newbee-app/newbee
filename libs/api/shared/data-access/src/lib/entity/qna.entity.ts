import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Qna } from '@newbee/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { PostEntity } from './post.abstract.entity';
import { TeamEntity } from './team.entity';

/**
 * The MikroORM entity representing a `QnA`, a type of `Post`.
 * The `slug` must be unique within an `organization`.
 */
@Entity()
@Unique<QnaEntity>({ properties: ['organization', 'slug'] })
export class QnaEntity extends PostEntity implements Qna {
  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrganizationEntity)
  organization: OrganizationEntity;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => TeamEntity, { nullable: true })
  team: TeamEntity | null;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrgMemberEntity)
  creator: OrgMemberEntity;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrgMemberEntity)
  maintainer: OrgMemberEntity | null = null;

  /**
   * @inheritdoc
   */
  @Property()
  slug: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text' })
  questionMarkdown: string;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  //  * @inheritdoc
  //  */
  // @Property({ type: 'text' })
  // renderedQuestion: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  answerMarkdown: string | null;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  //  * @inheritdoc
  //  */
  // @Property({ type: 'text' })
  // renderedAnswer: string;

  constructor(
    creator: OrgMemberEntity,
    team: TeamEntity | null,
    slug: string,
    questionMarkdown: string,
    // renderedQuestion: string,
    answerMarkdown: string | null
    // renderedAnswer: string,
  ) {
    super();
    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;
    this.slug = slug;
    this.questionMarkdown = questionMarkdown;
    // this.renderedQuestion = renderedQuestion;
    this.answerMarkdown = answerMarkdown;
    // this.renderedAnswer = renderedAnswer;
  }
}
