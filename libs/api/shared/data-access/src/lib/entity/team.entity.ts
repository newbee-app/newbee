import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TeamDocParams } from '@newbee/api/shared/util';
import type { Team } from '@newbee/shared/util';
import { TeamRoleEnum } from '@newbee/shared/util';
import { DocEntity } from './doc.entity';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { QnaEntity } from './qna.entity';
import { TeamMemberEntity } from './team-member.entity';

/**
 * The MikroORM entity representing a `Team`.
 * The team slug should be unique for the organization.
 */
@Entity()
@Unique<TeamEntity>({ properties: ['slug', 'organization'] })
export class TeamEntity implements Team {
  /**
   * The globally unique ID for the team.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
  id: string;

  /**
   * @inheritdoc
   */
  @Property()
  name: string;

  /**
   * @inheritdoc
   */
  @Property()
  slug: string;

  /**
   * All of the docs that belong to the team.
   * `orphanRemoval` is on, so if the team is deleted, so is its docs.
   * Additionally, if a doc is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => DocEntity, (doc) => doc.team, {
    orphanRemoval: true,
    hidden: true,
  })
  docs = new Collection<DocEntity>(this);

  /**
   * All of the QnAs that belong to the team.
   * `orphanRemoval` is on, so if the team is deleted, so is its QnAs.
   * Additionally, if a QnA is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => QnaEntity, (qna) => qna.team, {
    orphanRemoval: true,
    hidden: true,
  })
  qnas = new Collection<QnaEntity>(this);

  /**
   * The organization the team belongs to.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrganizationEntity, { hidden: true })
  organization: OrganizationEntity;

  /**
   * All of the members of the team.
   * `orphanRemoval` is on, so if the team is deleted, so is its team member entities.
   * Additionally, if a team member is removed from the collection, it is also deleted.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(() => TeamMemberEntity, (teamMember) => teamMember.team, {
    orphanRemoval: true,
    hidden: true,
  })
  teamMembers = new Collection<TeamMemberEntity>(this);

  constructor(
    id: string,
    name: string,
    slug: string,
    creator: OrgMemberEntity
  ) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.organization = creator.organization;
    new TeamMemberEntity(creator, this, TeamRoleEnum.Owner);
  }

  /**
   * Create the fields to add or replace a team doc in a Solr index.
   * @returns The params to add or replace a team doc using SolrCli.
   */
  createTeamDocParams(): TeamDocParams {
    return new TeamDocParams(this.id, this.slug, this.name);
  }

  /**
   * Call `removeAll` on all of the entity's collections.
   * If necessary, call remove all of the individual entities of a collection.
   */
  async prepareToDelete(): Promise<void> {
    const collections = [this.docs, this.qnas, this.teamMembers];
    for (const collection of collections) {
      if (!collection.isInitialized()) {
        await collection.init();
      }
      collection.removeAll();
    }
  }
}
