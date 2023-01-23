import {
  Check,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
} from '@mikro-orm/core';
import { isNotNull } from '@newbee/api/shared/util';
import { DocEntity } from './doc.entity';
import { GrantEntity } from './grant.entity';
import { OrganizationEntity } from './organization.entity';
import { QnAEntity } from './qna.entity';
import { TeamEntity } from './team.entity';

/**
 * The MikroORM entity representing a `Resource`.
 * A resource of some kind must be specified, but all of them are nullable individually.
 */
@Entity()
@Check<ResourceEntity>({
  name: 'requireAResource',
  expression: (columns) =>
    `${isNotNull(columns.organization)} OR ${isNotNull(
      columns.team
    )} OR ${isNotNull(columns.doc)} OR ${isNotNull(columns.qna)}`,
})
export class ResourceEntity {
  /**
   * The organization associated with the permission, if the resource is an organization.
   */
  @OneToOne(() => OrganizationEntity, {
    owner: true,
    nullable: true,
    unique: true,
    primary: true,
  })
  organization: OrganizationEntity | null = null;

  /**
   * The team associated with the permission, if the resource is a team.
   */
  @OneToOne(() => TeamEntity, {
    owner: true,
    nullable: true,
    unique: true,
    primary: true,
  })
  team: TeamEntity | null = null;

  /**
   * The doc associated with the permission, if the resource is a doc.
   */
  @OneToOne(() => DocEntity, {
    owner: true,
    nullable: true,
    unique: true,
    primary: true,
  })
  doc: DocEntity | null = null;

  /**
   * The QnA associated with the permission, if the resource is a QnA.
   */
  @OneToOne(() => QnAEntity, {
    owner: true,
    nullable: true,
    unique: true,
    primary: true,
  })
  qna: QnAEntity | null = null;

  /**
   * All of the grants that reference this resource.
   * `orphanRemoval` is on, so if the resource is deleted, so is its grants.
   * Additionally, if a grant is removed from the collection, it is also deleted.
   */
  @OneToMany(() => GrantEntity, (grant) => grant.resource, {
    orphanRemoval: true,
  })
  grants = new Collection<GrantEntity>(this);

  constructor(
    resource: OrganizationEntity | TeamEntity | DocEntity | QnAEntity
  ) {
    if (resource instanceof OrganizationEntity) {
      this.organization = resource;
    } else if (resource instanceof TeamEntity) {
      this.team = resource;
    } else if (resource instanceof DocEntity) {
      this.doc = resource;
    } else {
      this.qna = resource;
    }
  }
}
