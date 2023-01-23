import {
  Cascade,
  Entity,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CRUD, Possession } from '@newbee/api/shared/util';
import { GrantEntity } from './grant.entity';
import { OrganizationEntity } from './organization.entity';
import { Post } from './post.abstract.entity';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';
import { TeamEntity } from './team.entity';
import { UserOrganizationEntity } from './user-oraganization.entity';

/**
 * The MikroORM entity representing a `Doc`, a type of `Post`.
 * The `slug` must be unique within an `organization`.
 */
@Entity()
@Unique<DocEntity>({ properties: ['organization', 'slug'] })
export class DocEntity extends Post {
  /**
   * @inheritdoc
   */
  @ManyToOne(() => OrganizationEntity)
  organization!: OrganizationEntity;

  /**
   * @inheritdoc
   */
  @ManyToOne(() => TeamEntity, { nullable: true })
  team: TeamEntity | null = null;

  /**
   * @inheritdoc
   */
  @Property()
  slug!: string;

  /**
   * @inheritdoc
   */
  @OneToOne(() => ResourceEntity, (resource) => resource.doc, {
    cascade: [Cascade.ALL],
  })
  resource = new ResourceEntity(this);

  /**
   * The raw markdown that makes up the doc.
   */
  @Property({ type: 'text' })
  rawMarkdown!: string;

  /**
   * The raw markdown of the doc rendered into HTML, for display on the frontend.
   */
  @Property({ type: 'text' })
  renderedHtml!: string;

  constructor(
    organization: OrganizationEntity,
    slug: string,
    rawMarkdown: string,
    renderedHtml: string,
    creator: UserOrganizationEntity,
    optional?: { team?: TeamEntity }
  ) {
    super();
    this.organization = organization;
    this.slug = slug;
    this.rawMarkdown = rawMarkdown;
    this.renderedHtml = renderedHtml;

    const owner = new RoleEntity({ users: [creator] });
    this.generateOwnerGrants(owner);

    if (!optional) {
      return;
    }

    const { team } = optional;
    if (team) {
      this.team = team;
    }
  }

  /**
   * A helper function for generating the grants associated with the doc owner role.
   * @param owner The owner `RoleEntity`.
   */
  private generateOwnerGrants(owner: RoleEntity): void {
    const grants = [
      // Owners can update any property of the doc, except the ID, resource, createdAt, and the organization it belongs to
      new GrantEntity(owner, this.resource, CRUD.U, Possession.Any, [
        '*',
        '!id',
        '!createdAt',
        '!organization',
        '!resource',
      ]),
      // Owners can delete the doc itself (being able to delete the primary key implies being able to delete the doc)
      new GrantEntity(owner, this.resource, CRUD.D, Possession.Any, ['*']),
    ];
    this.resource.grants.add(grants);
  }
}
