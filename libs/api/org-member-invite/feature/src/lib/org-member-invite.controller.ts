import { Body, Controller, Logger, Post } from '@nestjs/common';
import { OrgMemberInviteService } from '@newbee/api/org-member-invite/data-access';
import {
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { OrgMember, Organization, Role, User } from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import {
  CreateOrgMemberInviteDto,
  Keyword,
  OrgMemberNoUser,
  TokenDto,
  apiRoles,
} from '@newbee/shared/util';

/**
 * The controller that interacts with `OrgMemberInviteEntity`.
 */
@Controller({
  path: Keyword.Invite,
  version: apiVersion['org-member-invite'],
})
export class OrgMemberInviteController {
  private readonly logger = new Logger(OrgMemberInviteController.name);

  constructor(
    private readonly orgMemberInviteService: OrgMemberInviteService,
    private readonly entityService: EntityService,
  ) {}

  /**
   * Creates an invite for a user to join an organization.
   *
   * @param createOrgMemberInviteDto The information necessary to create an invite.
   * @param user The user that sent the request and will be the inviter.
   *
   * @throws {ForbiddenException} `forbiddenError`. If the inviter has a lower role than the invitee.
   * @throws {BadRequestException} `orgMemberAlreadyBadRequest`, `orgMemberInvitedBadRequest`. If the invitee is already an org member or if they've already been invited to the organization.
   */
  @Post(`${Keyword.Organization}/:${Keyword.Organization}`)
  @Role(apiRoles['org-member-invite'].invite)
  async invite(
    @Body() createOrgMemberInviteDto: CreateOrgMemberInviteDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<void> {
    const { email, role } = createOrgMemberInviteDto;
    this.logger.log(
      `Invite org member request received for organization ID: ${organization.id}, for email: ${email}, by org member slug: ${orgMember.slug}`,
    );
    const orgMemberInvite = await this.orgMemberInviteService.create(
      email,
      role,
      orgMember,
      organization,
    );
    this.logger.log(`Created org member invite, id: ${orgMemberInvite.id}`);
  }

  /**
   * Accepts an invite to join an organization.
   *
   * @param tokenDto The token of the invite to accept.
   * @param user The user that sent the request and should be the invitee.
   *
   * @throws {NotFoundException} `orgMemberInviteTokenNotFound`. If the org member invite could not be found.
   * @throws {ForbiddenException} `forbiddenError`. If the user is not the invitee.
   * @throws {BadRequestException} `userAlreadyOrgMemberBadRequest`. If the user is already an org member.
   */
  @Post(Keyword.Accept)
  async accept(
    @Body() tokenDto: TokenDto,
    @User() user: UserEntity,
  ): Promise<OrgMemberNoUser> {
    const { token } = tokenDto;
    this.logger.log(
      `Accept org member invite request received, token: ${token}, user ID: ${user.id}`,
    );
    const orgMember = await this.orgMemberInviteService.acceptInvite(
      token,
      user,
    );
    this.logger.log(
      `Accepted org member invite for token: ${token}, orgMember created with slug: ${orgMember.slug}`,
    );
    return await this.entityService.createOrgMemberNoUser(orgMember);
  }

  /**
   * Declines an invite to join an organization.
   *
   * @param tokenDto The token of the invite to decline.
   * @param user The user that sent the request and should be the invitee.
   *
   * @throws {NotFoundException} `orgMemberInviteTokenNotfound`. If the org member invite could not be found.
   * @throws {ForbiddenException} `forbiddenError`. If the user is not the invitee.
   */
  @Post(Keyword.Decline)
  async decline(
    @Body() tokenDto: TokenDto,
    @User() user: UserEntity,
  ): Promise<void> {
    const { token } = tokenDto;
    this.logger.log(
      `Decline org member invite request received, token: ${token}, user ID: ${user.id}`,
    );
    await this.orgMemberInviteService.declineInvite(token, user);
    this.logger.log(`Declined org member invite for token: ${token}`);
  }
}
