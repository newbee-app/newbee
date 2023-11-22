import Markdoc from '@markdoc/markdoc';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import markdocTxtRenderer from '@newbee/markdoc-txt-renderer';
import type { Qna } from '@newbee/shared/util';
import { strToContent } from '@newbee/shared/util';
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
  @ManyToOne(() => OrgMemberEntity, { hidden: true, nullable: true })
  creator: OrgMemberEntity | null;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrgMemberEntity, { hidden: true, nullable: true })
  maintainer: OrgMemberEntity | null = null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  questionMarkdoc: string | null;

  /**
   * The question markdoc converted into plain text.
   */
  @Property({ type: 'text', nullable: true })
  questionTxt: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  questionHtml: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  answerMarkdoc: string | null;

  /**
   * The answer markdoc converted into plain text.
   */
  @Property({ type: 'text', nullable: true })
  answerTxt: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  answerHtml: string | null;

  constructor(
    id: string,
    title: string,
    team: TeamEntity | null,
    creator: OrgMemberEntity,
    questionMarkdoc: string | null,
    answerMarkdoc: string | null,
  ) {
    super(id, title, null, team, creator);

    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;

    this.questionMarkdoc = questionMarkdoc;
    if (questionMarkdoc) {
      const content = strToContent(questionMarkdoc);
      this.questionTxt = markdocTxtRenderer(content);
      this.questionHtml = Markdoc.renderers.html(content);
    } else {
      this.questionTxt = null;
      this.questionHtml = null;
    }

    this.answerMarkdoc = answerMarkdoc;
    if (answerMarkdoc) {
      const content = strToContent(answerMarkdoc);
      this.answerTxt = markdocTxtRenderer(content);
      this.answerHtml = Markdoc.renderers.html(content);
    } else {
      this.answerTxt = null;
      this.answerHtml = null;
    }
  }
}
