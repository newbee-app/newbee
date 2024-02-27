import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { shortenUuid } from '@newbee/api/shared/util';
import type { OrgMemberInvite } from '@newbee/shared/util';
import { OrgRoleEnum, ascOrgRoleEnum } from '@newbee/shared/util';
import { CommonEntity } from './common.abstract.entity';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { UserInvitesEntity } from './user-invites.entity';

/**
 * The MikroORM entity representing an org member invite.
 */
@Entity()
@Unique<OrgMemberInviteEntity>({ properties: ['organization', 'userInvites'] })
export class OrgMemberInviteEntity
  extends CommonEntity
  implements OrgMemberInvite
{
  /**
   * @inheritdoc
   */
  @Property({ unique: true })
  token: string;

  /**
   * @inheritdoc
   */
  @Enum({
    items: () => OrgRoleEnum,
    customOrder: ascOrgRoleEnum,
  })
  role: OrgRoleEnum;

  /**
   * The organization the invitation is for.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrganizationEntity, { hidden: true })
  @Index()
  organization: OrganizationEntity;

  /**
   * The user who was invited.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => UserInvitesEntity, { hidden: true })
  @Index()
  userInvites: UserInvitesEntity;

  /**
   * The org member who invited the user.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrgMemberEntity, { hidden: true })
  @Index()
  inviter: OrgMemberEntity;

  constructor(
    id: string,
    userInvites: UserInvitesEntity,
    inviter: OrgMemberEntity,
    role: OrgRoleEnum,
  ) {
    super(id);

    this.token = shortenUuid(id);
    this.organization = inviter.organization;
    this.userInvites = userInvites;
    this.inviter = inviter;
    this.role = role;
  }
}
