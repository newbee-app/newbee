import {
  Cascade,
  Entity,
  ManyToOne,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { CRUD, Possession } from '@newbee/api/shared/util';
import { Doc } from '@newbee/shared/util';
import { GrantEntity } from './grant.entity';
import { OrganizationEntity } from './organization.entity';
import { PostEntity } from './post.abstract.entity';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';
import { TeamEntity } from './team.entity';
import { UserOrganizationEntity } from './user-organization.entity';

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
  @Property()
  slug: string;

  /**
   * @inheritdoc
   */
  @OneToOne(() => ResourceEntity, (resource) => resource.doc, {
    cascade: [Cascade.ALL],
  })
  resource = new ResourceEntity(this);

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
    team: TeamEntity | null,
    slug: string,
    rawMarkdown: string,
    // renderedHtml: string,
    creator: UserOrganizationEntity
  ) {
    super();
    this.organization = creator.organization;
    this.team = team;
    this.slug = slug;
    this.rawMarkdown = rawMarkdown;
    // this.renderedHtml = renderedHtml;

    const owner = new RoleEntity({ users: [creator] });
    this.generateOwnerGrants(owner);
  }

  /**
   * A helper function for generating the grants associated with the doc owner role.
   * @param owner The owner `RoleEntity`.
   */
  private generateOwnerGrants(owner: RoleEntity): void {
    // Owners can update any property of the doc, except the ID, resource, createdAt, and the organization it belongs to
    new GrantEntity(owner, this.resource, CRUD.U, Possession.Any, [
      '*',
      '!id',
      '!createdAt',
      '!organization',
      '!resource',
    ]);

    // Owners can delete the doc itself (being able to delete the primary key implies being able to delete the doc)
    new GrantEntity(owner, this.resource, CRUD.D, Possession.Any, ['*']);
  }
}
