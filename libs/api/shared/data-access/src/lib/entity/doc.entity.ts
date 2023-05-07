import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { markdocToTxt } from '@newbee/api/shared/util';
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
   * The raw markdoc converted into plain text.
   */
  @Property({ type: 'text', hidden: true })
  docTxt: string;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  //  * @inheritdoc
  //  */
  // @Property({ type: 'text' })
  // docHtml: string;

  constructor(
    id: string,
    title: string,
    creator: OrgMemberEntity,
    team: TeamEntity | null,
    docMarkdoc: string
    // docHtml: string,
  ) {
    super(id, title);
    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;
    this.maintainer = creator;
    this.docMarkdoc = docMarkdoc;
    this.docTxt = markdocToTxt(docMarkdoc);
    // this.docHtml = docHtml;
  }
}
