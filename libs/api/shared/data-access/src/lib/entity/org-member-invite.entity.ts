import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { shortenUuid } from '@newbee/api/shared/util';
import type { OrgMemberInvite } from '@newbee/shared/util';
import { ascOrgRoleEnum, OrgRoleEnum } from '@newbee/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { UserInvitesEntity } from './user-invites.entity';

/**
 * The MikroORM entity representing an org member invite.
 */
@Entity()
@Unique<OrgMemberInviteEntity>({ properties: ['organization', 'userInvites'] })
export class OrgMemberInviteEntity implements OrgMemberInvite {
  /**
   * The globally unique ID for the org member invite.
   */
  @PrimaryKey()
  id: string;

  /**
   * @inheritdoc
   */
  @Property({ unique: true })
  token: string;

  /**
   * The organization the invitation is for.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrganizationEntity, { hidden: true })
  organization: OrganizationEntity;

  /**
   * The user who was invited.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => UserInvitesEntity, { hidden: true })
  userInvites: UserInvitesEntity;

  /**
   * The org member who invited the user.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => OrgMemberEntity, { hidden: true })
  inviter: OrgMemberEntity;

  /**
   * @inheritdoc
   */
  @Enum({
    items: () => OrgRoleEnum,
    customOrder: ascOrgRoleEnum,
  })
  role: OrgRoleEnum;

  constructor(
    id: string,
    userInvites: UserInvitesEntity,
    inviter: OrgMemberEntity,
    role: OrgRoleEnum
  ) {
    this.id = id;
    this.token = shortenUuid(id);
    this.organization = inviter.organization;
    this.userInvites = userInvites;
    this.inviter = inviter;
    this.role = role;
  }
}
