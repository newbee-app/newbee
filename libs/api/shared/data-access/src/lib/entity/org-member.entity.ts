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
import { OrgMember, OrgRoleEnum, ascOrgRoleEnum } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { CommonEntity } from './common.abstract.entity';
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
@Unique<OrgMemberEntity>({ properties: ['user', 'organization'] })
export class OrgMemberEntity extends CommonEntity implements OrgMember {
  /**
   * @inheritdoc
   */
  @Enum({
    items: () => OrgRoleEnum,
    customOrder: ascOrgRoleEnum,
  })
  role: OrgRoleEnum;

  /**
   * @inheritdoc
   */
  @Property()
  slug: string = translator.new();

  /**
   * The user associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => UserEntity, { hidden: true })
  user: UserEntity;

  /**
   * The organization associated with this entity.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrganizationEntity, { hidden: true })
  organization: OrganizationEntity;

  /**
   * The teams the org member is a part of along with the role the org member holds.
   * Acts as a hidden property, meaning it will never be serialized.
   * Additionally, if a team member is removed from the collection, it is also deleted.
   */
  @OneToMany(() => TeamMemberEntity, (teamMember) => teamMember.orgMember, {
    hidden: true,
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
    role: OrgRoleEnum,
  ) {
    super(v4());

    this.user = user;
    this.organization = organization;
    this.role = role;
  }
}
