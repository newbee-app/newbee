import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException } from '@nestjs/common';
import { OrgMemberDocParams, translator } from '@newbee/api/shared/util';
import {
  cannotDeleteMaintainerBadReqest,
  cannotDeleteOnlyOrgOwnerBadRequest,
  OrgMember,
  OrgRoleEnum,
} from '@newbee/shared/util';
import { DocEntity } from './doc.entity';
import { OrganizationEntity } from './organization.entity';
import { QnaEntity } from './qna.entity';
import { TeamMemberEntity } from './team-member.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing the link between users and thier organizations.
 * The org member's slug should be unique within the organization.
 */
@Entity()
@Unique<OrgMemberEntity>({ properties: ['organization', 'slug'] })
export class OrgMemberEntity implements OrgMember {
  /**
   * The user associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => UserEntity, { primary: true, hidden: true })
  user: UserEntity;

  /**
   * The organization associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrganizationEntity, { primary: true, hidden: true })
  organization: OrganizationEntity;

  /**
   * @inheritdoc
   */
  @Enum(() => OrgRoleEnum)
  role: OrgRoleEnum;

  /**
   * @inheritdoc
   */
  @Property()
  slug: string = translator.new();

  /**
   * The teams the org member is a part of along with the role the org member holds.
   * Acts as a hidden property, meaning it will never be serialized.
   * `orphanRemoval` is on, so if the org member is deleted, so is its team member entities.
   * Additionally, if a team member is removed from the collection, it is also deleted.
   */
  @OneToMany(() => TeamMemberEntity, (teamMember) => teamMember.orgMember, {
    hidden: true,
    orphanRemoval: true,
  })
  teams = new Collection<TeamMemberEntity>(this);

  /**
   * The docs the org member created.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @OneToMany(() => DocEntity, (doc) => doc.creator, { hidden: true })
  createdDocs = new Collection<DocEntity>(this);

  /**
   * The docs the org member maintains.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @OneToMany(() => DocEntity, (doc) => doc.maintainer, { hidden: true })
  maintainedDocs = new Collection<DocEntity>(this);

  /**
   * The qnas the org member created.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @OneToMany(() => QnaEntity, (qna) => qna.creator, { hidden: true })
  createdQnas = new Collection<QnaEntity>(this);

  /**
   * The qnas the org member maintains.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @OneToMany(() => QnaEntity, (qna) => qna.maintainer, { hidden: true })
  maintainedQnas = new Collection<QnaEntity>(this);

  /**
   * Specifies the primary key of the entity.
   * In this case, it's a composite primary key consisting of the foreign keys of `user` and `organization`.
   */
  [PrimaryKeyType]?: [string, string];

  constructor(
    user: UserEntity,
    organization: OrganizationEntity,
    role: OrgRoleEnum
  ) {
    this.user = user;
    this.organization = organization;
    this.role = role;
  }

  /**
   * Gets the ID for the entity as a comma-delimited string.
   */
  get id(): string {
    return `${this.user.id},${this.organization.id}`;
  }

  /**
   * Create the fields to add or replace an org member doc in a Solr index.
   * @returns The params to add or replace an org member doc using SolrCli.
   */
  async createOrgMemberDocParams(): Promise<OrgMemberDocParams> {
    if (!wrap(this.user).isInitialized()) {
      await wrap(this.user).init();
    }

    return new OrgMemberDocParams(
      this.id,
      this.slug,
      this.user.name,
      this.user.displayName
    );
  }

  /**
   * Checks whether this instance of OrgMemberEntity is safe to delete and throws a `BadRequestException` if it's not.
   * If any of the teams the user is in is not safe to delete, it is nto safe to delete.
   * If the org member is the only owner of the org, it's not safe to delete.
   * Otherwise, it's safe to delete.
   *
   * @param em The entity manager to use to find all owners of this org member's org.
   *
   * @throws {BadRequestException} `cannotDeleteMaintainerBadRequest`, `cannotDeleteOnlyTeamOwnerBadRequest`, `cannotDeleteOnlyOrgOwnerBadRequest`. If the org member still maintains any posts, any of the teams the user is in is not safe to delete, or the org member is the only owner of the org.
   * @throws {Error} Any of the errors `find` can throw.
   */
  async safeToDelete(em: EntityManager): Promise<void> {
    const toInitialize = [this.maintainedDocs, this.maintainedQnas, this.teams];
    for (const collection of toInitialize) {
      if (!collection.isInitialized()) {
        await collection.init();
      }
    }

    if (this.maintainedDocs.length || this.maintainedQnas.length) {
      throw new BadRequestException(cannotDeleteMaintainerBadReqest);
    }

    for (const teamMember of this.teams) {
      await teamMember.safeToDelete(em);
    }

    if (this.role !== OrgRoleEnum.Owner) {
      return;
    }

    const owners = await em.find(OrgMemberEntity, {
      role: OrgRoleEnum.Owner,
      organization: this.organization,
    });
    if (owners.length === 1) {
      throw new BadRequestException(cannotDeleteOnlyOrgOwnerBadRequest);
    }
  }

  /**
   * Prepare to delete this instance by calling `removeAll` on all of the entity's collections with `orphanRemoval` on.
   *
   * @throws {Error} Any of the errors 'init` can throw.
   */
  async prepareToDelete(): Promise<void> {
    const collections = [
      this.teams,
      this.createdDocs,
      this.maintainedDocs,
      this.createdQnas,
      this.maintainedQnas,
    ];
    for (const collection of collections) {
      if (!collection.isInitialized()) {
        await collection.init();
      }
    }

    this.teams.removeAll();
  }
}
