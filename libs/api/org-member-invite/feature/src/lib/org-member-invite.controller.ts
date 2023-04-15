import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import {
  CreateOrgMemberInviteDto,
  OrgMemberInviteService,
  TokenDto,
} from '@newbee/api/org-member-invite/data-access';
import { OrganizationGuard } from '@newbee/api/organization/data-access';
import { OrganizationEntity, UserEntity } from '@newbee/api/shared/data-access';
import { Organization, Role, User } from '@newbee/api/shared/util';
import {
  accept,
  decline,
  invite,
  organization,
  orgMemberInviteVersion,
} from '@newbee/shared/data-access';
import { OrgRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `OrgMemberInviteEntity`.
 */
@Controller({
  path: invite,
  version: orgMemberInviteVersion,
})
export class OrgMemberInviteController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(OrgMemberInviteController.name);

  constructor(
    private readonly orgMemberInviteService: OrgMemberInviteService
  ) {}

  /**
   * Creates an invite for a user to join an organization.
   *
   * @param createOrgMemberInviteDto The information necessary to create an invite.
   * @param user The user that sent the request and will be the inviter.
   *
   * @throws {BadRequestException} `orgMemberAlreadyBadRequest`, `orgMemberInvitedBadRequest`. If the invitee is already an org member or if they've already been invited to the organization.
   * @throws {NotFoundException} `organizationSlugNotFound`, `orgMemberNotFound`. If the organization or the inviter could not be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post(`${organization}/:${organization}`)
  @UseGuards(OrganizationGuard)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async invite(
    @Body() createOrgMemberInviteDto: CreateOrgMemberInviteDto,
    @User() user: UserEntity,
    @Organization() organization: OrganizationEntity
  ): Promise<void> {
    const { email, role } = createOrgMemberInviteDto;
    this.logger.log(
      `Invite org member request received for organization ID: ${organization.id}, for email: ${email}, by user ID: ${user.id}`
    );
    const orgMemberInvite = await this.orgMemberInviteService.create(
      email,
      user,
      role,
      organization
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
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post(accept)
  async accept(
    @Body() tokenDto: TokenDto,
    @User() user: UserEntity
  ): Promise<void> {
    const { token } = tokenDto;
    this.logger.log(
      `Accept org member invite request received, token: ${token}, user ID: ${user.id}`
    );
    const orgMember = await this.orgMemberInviteService.acceptInvite(
      token,
      user
    );
    this.logger.log(
      `Accepted org member invite for token: ${token}, orgMember created with slug: ${orgMember.slug}`
    );
  }

  /**
   * Declines an invite to join an organization.
   *
   * @param tokenDto The token of the invite to decline.
   * @param user The user that sent the request and should be the invitee.
   *
   * @throws {NotFoundException} `orgMemberInviteTokenNotfound`. If the org member invite could not be found.
   * @throws {ForbiddenException} `forbiddenError`. If the user is not the invitee.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post(decline)
  async decline(
    @Body() tokenDto: TokenDto,
    @User() user: UserEntity
  ): Promise<void> {
    const { token } = tokenDto;
    this.logger.log(
      `Decline org member invite request received, token: ${token}, user ID: ${user.id}`
    );
    await this.orgMemberInviteService.declineInvite(token, user);
    this.logger.log(`Declined org member invite for token: ${token}`);
  }
}
