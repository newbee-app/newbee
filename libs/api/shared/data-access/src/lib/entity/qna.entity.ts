import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { renderMarkdoc } from '@newbee/api/shared/util';
import type { Qna } from '@newbee/shared/util';
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
  @Property({ type: 'text', nullable: true })
  questionMarkdoc: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  questionHtml: string | null;

  /**
   * The question markdoc converted into plain text.
   * `hidden` is on, so it will never be serialized.
   */
  @Property({ type: 'text', nullable: true, hidden: true })
  questionTxt: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  answerMarkdoc: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text', nullable: true })
  answerHtml: string | null;

  /**
   * The answer markdoc converted into plain text.
   * `hidden` is on, so it will never be serialized.
   */
  @Property({ type: 'text', nullable: true, hidden: true })
  answerTxt: string | null;

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

  constructor(
    title: string,
    team: TeamEntity | null,
    creator: OrgMemberEntity,
    questionMarkdoc: string | null,
    answerMarkdoc: string | null,
  ) {
    super(title, null, team, creator);

    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;

    this.questionMarkdoc = questionMarkdoc;
    let { html, txt } = renderMarkdoc(questionMarkdoc);
    this.questionHtml = html ?? null;
    this.questionTxt = txt ?? null;

    this.answerMarkdoc = answerMarkdoc;
    ({ html, txt } = renderMarkdoc(answerMarkdoc));
    this.answerHtml = html ?? null;
    this.answerTxt = txt ?? null;
  }
}
