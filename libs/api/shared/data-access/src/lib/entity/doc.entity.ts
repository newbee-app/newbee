import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { Doc } from '@newbee/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { PostEntity } from './post.abstract.entity';
import { TeamEntity } from './team.entity';

/**
 * The MikroORM entity representing a `Doc`, a type of `Post`.
 * The `slug` must be unique within an `organization`.
 */
@Entity()
@Unique<DocEntity>({ properties: ['organization', 'slug'] })
export class DocEntity extends PostEntity implements Doc {
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
  rawMarkdown: string;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  //  * @inheritdoc
  //  */
  // @Property({ type: 'text' })
  // renderedHtml: string;

  constructor(
    creator: OrgMemberEntity,
    team: TeamEntity | null,
    slug: string,
    rawMarkdown: string
    // renderedHtml: string,
  ) {
    super();
    this.organization = creator.organization;
    this.team = team;
    this.creator = creator;
    this.maintainer = creator;
    this.slug = slug;
    this.rawMarkdown = rawMarkdown;
    // this.renderedHtml = renderedHtml;
  }
}
