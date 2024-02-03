import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  EntityService,
  OrgMemberEntity,
  OrgMemberInviteEntity,
  OrganizationEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { AppConfig, elongateUuid, shortenUuid } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  Keyword,
  OrgRoleEnum,
  forbiddenError,
  internalServerError,
  orgMemberAlreadyBadRequest,
  orgMemberInviteTokenNotFound,
  orgMemberInvitedBadRequest,
} from '@newbee/shared/util';
import { v4 } from 'uuid';

/**
 * The service that interacts with `OrgMemberInviteEntity`.
 */
@Injectable()
export class OrgMemberInviteService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(OrgMemberInviteService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly entityService: EntityService,
    private readonly userService: UserService,
    private readonly userInvitesService: UserInvitesService,
    private readonly orgMemberService: OrgMemberService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  /**
   * Creates a new `OrgMemberInviteEntity` using the given `UserInvitesEntity`, `OrgMemberEntity`, and `OrgRoleEnum`.
   * Sends an email to the user inviting them to join the organization.
   *
   * @param email The email of the invitee.
   * @param role The role the invitee will have in the organization.
   * @param inviter The inviter.
   * @param organization The organization the invitee will be invited to.
   *
   * @returns A new `OrgMemberInviteEntity` instance.
   * @throws {ForbiddenException} `forbiddenError`. If the inviter has a lower role than the invitee.
   * @throws {BadRequestException} `orgMemberAlreadyBadRequest`, `orgMemberInvitedBadRequest`. If the invitee is already an org member or if they've already been invited to the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  async create(
    email: string,
    role: OrgRoleEnum,
    inviter: OrgMemberEntity,
    organization: OrganizationEntity,
  ): Promise<OrgMemberInviteEntity> {
    OrgMemberService.checkRequesterOrgRole(inviter.role, role);
    await this.checkIfOrgMember(organization, email);

    const userInvites =
      await this.userInvitesService.findOrCreateOneByEmail(email);
    const id = v4();
    const token = shortenUuid(id);
    const orgMemberInvite = new OrgMemberInviteEntity(
      id,
      userInvites,
      inviter,
      role,
    );

    const acceptLink =
      this.configService.get('rpInfo.origin', {
        infer: true,
      }) + `/${Keyword.Invite}/${Keyword.Accept}/${token}`;
    const declineLink =
      this.configService.get('rpInfo.origin', {
        infer: true,
      }) + `/${Keyword.Invite}/${Keyword.Decline}/${token}`;

    try {
      await this.em.persistAndFlush(orgMemberInvite);
      await this.mailerService.sendMail({
        to: email,
        subject: `Your NewBee Invitation`,
        text: `${inviter.user.email} has invited you to join ${inviter.organization.name} as an ${role}.\nPlease click the link below to accept your invitation: ${acceptLink}\nPlease click the link below to decline your invitation: ${declineLink}\nOtherwise, log in to your NewBee account to accept your invitation.`,
        html: `<p>${inviter.user.email} has invited you to join ${inviter.organization.name} as an ${role}.</p><p>Please click the link below to accept your invitation: <a href="${acceptLink}">${acceptLink}</a></p><p>Please click the link below to decline your invitation: <a href="${declineLink}">${declineLink}</a></p><p>Otherwise, log in to your NewBee account to accept your invitation.</p>`,
      });
      return orgMemberInvite;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(orgMemberInvitedBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `OrgMemberInviteEntity` associated with the given `token`.
   *
   * @param token The token to search for.
   *
   * @returns The `OrgMemberInviteEntity` associated with the given `token`.
   * @throws {NotFoundException} `orgMemberInviteTokenNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByToken(token: string): Promise<OrgMemberInviteEntity> {
    const id = elongateUuid(token);
    try {
      return await this.em.findOneOrFail(OrgMemberInviteEntity, id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(orgMemberInviteTokenNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given `OrgMemberInviteEntity`.
   * If the `OrgMemberInviteEntity` is the only invite the user invites object has, it deletes the user invites object if there is no registered user attached to it.
   *
   * @param orgMemberInvite The `OrgMemberInviteEntity` to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(orgMemberInvite: OrgMemberInviteEntity): Promise<void> {
    try {
      await this.em.populate(orgMemberInvite, [
        'userInvites.orgMemberInvites',
        'userInvites.user',
      ]);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const { userInvites } = orgMemberInvite;
    if (!userInvites.user && userInvites.orgMemberInvites.length === 1) {
      await this.userInvitesService.delete(userInvites);
      return;
    }

    await this.entityService.safeToDelete(orgMemberInvite);
    try {
      await this.em.removeAndFlush(orgMemberInvite);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Accepts an organization invite and creates a new `OrgMemberEntity` for the invitee.
   * Deletes the `OrgMemberInviteEntity`.
   *
   * @param token The token for the `OrgMemberInviteEntity` to accept.
   * @param user The user who made the request.
   *
   * @returns The new `OrgMemberEntity` created for the invitee.
   * @throws {NotFoundException} `orgMemberInviteTokenNotFound`. If the org member invite could not be found.
   * @throws {ForbiddenException} `forbiddenError`. If the user is not the invitee.
   * @throws {BadRequestException} `userAlreadyOrgMemberBadRequest`. If the user is already an org member.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  async acceptInvite(
    token: string,
    user: UserEntity,
  ): Promise<OrgMemberEntity> {
    const orgMemberInvite = await this.findOneByToken(token);
    await this.checkUser(user, orgMemberInvite);

    try {
      await this.em.populate(orgMemberInvite, ['organization']);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const orgMember = await this.orgMemberService.create(
      user,
      orgMemberInvite.organization,
      orgMemberInvite.role,
    );
    await this.delete(orgMemberInvite);

    return orgMember;
  }

  /**
   * Declines an organization invite and deletes the `OrgMemberInviteEntity`.
   *
   * @param token The token of the `OrgMemberInviteEntity` to decline.
   * @param user The user who made the request.
   *
   * @throws {NotFoundException} `orgMemberInviteTokenNotfound`. If the org member invite could not be found.
   * @throws {ForbiddenException} `forbiddenError`. If the user is not the invitee.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  async declineInvite(token: string, user: UserEntity): Promise<void> {
    const orgMemberInvite = await this.findOneByToken(token);
    await this.checkUser(user, orgMemberInvite);
    await this.delete(orgMemberInvite);
  }

  /**
   * A helper function that throws a BadRequestException if a user with the given email is already a member of the given organization.
   *
   * @param organization The organization to check.
   * @param email The email to check.
   *
   * @throws {BadRequestException} `orgMemberAlreadyBadRequest`. If the user is already a member of the organization.
   */
  private async checkIfOrgMember(
    organization: OrganizationEntity,
    email: string,
  ): Promise<void> {
    const user = await this.userService.findOneByEmailOrNull(email);
    if (!user) {
      return;
    }

    const orgMember = await this.orgMemberService.findOneByUserAndOrgOrNull(
      user,
      organization,
    );
    if (!orgMember) {
      return;
    }

    throw new BadRequestException(orgMemberAlreadyBadRequest);
  }

  /**
   * A helper function that throws a ForbiddenException if the given `user` is not the invitee of the given `orgMemberInvite`.
   *
   * @param user The user to check.
   * @param orgMemberInvite The `OrgMemberInviteEntity` to check.
   *
   * @returns `true` if the given `user` is the invitee of the given `orgMemberInvite`, `false` otherwise.
   * @throws {ForbiddenException} `forbiddenError`. If the user is not the invitee.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  private async checkUser(
    user: UserEntity,
    orgMemberInvite: OrgMemberInviteEntity,
  ): Promise<void> {
    try {
      await this.em.populate(orgMemberInvite, ['userInvites.user']);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    if (orgMemberInvite.userInvites.user?.id !== user.id) {
      throw new ForbiddenException(forbiddenError);
    }
  }
}
