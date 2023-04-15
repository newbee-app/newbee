import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { shortenUuid } from '@newbee/api/shared/util';
import { OrgRoleEnum } from '@newbee/shared/util';
import { OrgMemberEntity } from './org-member.entity';
import { OrganizationEntity } from './organization.entity';
import { UserInvitesEntity } from './user-invites.entity';

/**
 * The MikroORM entity representing an org member invite.
 */
@Entity()
@Unique<OrgMemberInviteEntity>({ properties: ['organization', 'userInvites'] })
export class OrgMemberInviteEntity {
  /**
   * The globally unique ID for the org member invite.
   */
  @PrimaryKey()
  id: string;

  /**
   * The token representing the org member invite.
   * Represents a shortened version of the `id`.
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
   * The role the user will have in the organization.
   */
  @Enum(() => OrgRoleEnum)
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
