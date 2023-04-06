import Markdoc from '@markdoc/markdoc';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { markdocToTxt, QnaDocParams } from '@newbee/api/shared/util';
import markdocTxtRenderer from '@newbee/markdoc-txt-renderer';
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
  questionMarkdoc: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  questionTxt: string | null;

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
  answerMarkdoc: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  answerTxt: string | null;

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
    questionMarkdoc: string | null,
    // renderedQuestion: string,
    answerMarkdoc: string | null
    // renderedAnswer: string,
  ) {
    super(id, title);
    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;
    this.questionMarkdoc = questionMarkdoc;
    this.questionTxt = questionMarkdoc ? markdocToTxt(questionMarkdoc) : null;
    // this.renderedQuestion = renderedQuestion;
    this.answerMarkdoc = answerMarkdoc;
    this.answerTxt = answerMarkdoc ? markdocToTxt(answerMarkdoc) : null;
    // this.renderedAnswer = renderedAnswer;

    if (questionMarkdoc) {
      const ast = Markdoc.parse(questionMarkdoc);
      const content = Markdoc.transform(ast);
      this.questionTxt = markdocTxtRenderer(content);
    }

    if (answerMarkdoc) {
      const ast = Markdoc.parse(answerMarkdoc);
      const content = Markdoc.transform(ast);
      this.answerTxt = markdocTxtRenderer(content);
    }
  }

  /**
   * Create the fields to add or replace a qna doc in a Solr index.
   * @returns The params to add or replace a qna doc using SolrCli.
   */
  createQnaDocParams(): QnaDocParams {
    return new QnaDocParams(
      this.id,
      this.slug,
      this.team?.id ?? null,
      this.createdAt,
      this.updatedAt,
      this.markedUpToDateAt,
      this.upToDate,
      this.creator.id,
      this.maintainer?.id ?? null,
      this.title,
      this.questionTxt,
      this.answerTxt
    );
  }
}
