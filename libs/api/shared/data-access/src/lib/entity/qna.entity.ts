import { Entity, ManyToOne, Property } from '@mikro-orm/core';
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
export class QnaEntity extends PostEntity implements Qna {
  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrganizationEntity, { hidden: true })
  organization: OrganizationEntity;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => TeamEntity, { nullable: true, hidden: true })
  team: TeamEntity | null;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrgMemberEntity, { hidden: true })
  creator: OrgMemberEntity;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrgMemberEntity, { nullable: true, hidden: true })
  maintainer: OrgMemberEntity | null = null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  questionMarkdown: string | null;

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
    id: string,
    title: string,
    creator: OrgMemberEntity,
    team: TeamEntity | null,
    questionMarkdown: string | null,
    // renderedQuestion: string,
    answerMarkdown: string | null
    // renderedAnswer: string,
  ) {
    super(id, title);
    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;
    this.questionMarkdown = questionMarkdown;
    // this.renderedQuestion = renderedQuestion;
    this.answerMarkdown = answerMarkdown;
    // this.renderedAnswer = renderedAnswer;
  }
}
