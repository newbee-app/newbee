import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { translator } from '@newbee/api/shared/util';
import { OrgMember, OrgRoleEnum } from '@newbee/shared/util';
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
   * Gets the ID for the entity as a comma-delimited string.
   */
  @Property({ persist: false })
  get id(): string {
    return `${this.user.id},${this.organization.id}`;
  }

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
}
