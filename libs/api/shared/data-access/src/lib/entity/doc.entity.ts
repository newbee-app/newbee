import Markdoc from '@markdoc/markdoc';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import markdocTxtRenderer from '@newbee/markdoc-txt-renderer';
import type { Doc } from '@newbee/shared/util';
import { strToContent } from '@newbee/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { PostEntity } from './post.abstract.entity';
import { TeamEntity } from './team.entity';

/**
 * The MikroORM entity representing a `Doc`, a type of `Post`.
 * The `slug` must be unique within an `organization`.
 */
@Entity()
export class DocEntity extends PostEntity implements Doc {
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
  @Property({ type: 'text' })
  docMarkdoc: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text' })
  docHtml: string;

  /**
   * The raw markdoc converted into plain text.
   * `hidden` is on, so it will never be serialized.
   */
  @Property({ type: 'text', hidden: true })
  docTxt: string;

  constructor(
    id: string,
    title: string,
    upToDateDuration: string | null,
    team: TeamEntity | null,
    creator: OrgMemberEntity,
    docMarkdoc: string,
  ) {
    super(id, title, upToDateDuration, team, creator);

    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;
    this.maintainer = creator;

    this.docMarkdoc = docMarkdoc;
    const content = strToContent(docMarkdoc);
    this.docHtml = Markdoc.renderers.html(content);
    this.docTxt = markdocTxtRenderer(content);
  }
}
