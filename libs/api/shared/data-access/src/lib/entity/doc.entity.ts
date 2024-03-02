import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { renderMarkdoc } from '@newbee/api/shared/util';
import type { Doc } from '@newbee/shared/util';
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
    upToDateDuration: string | null,
    team: TeamEntity | null,
    creator: OrgMemberEntity,
    docMarkdoc: string,
  ) {
    super(title, upToDateDuration, team, creator);

    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;
    this.maintainer = creator;

    this.docMarkdoc = docMarkdoc;
    const { html, txt } = renderMarkdoc(docMarkdoc);
    this.docHtml = html ?? '';
    this.docTxt = txt ?? '';
  }
}
