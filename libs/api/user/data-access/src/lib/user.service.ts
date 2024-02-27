import type { EntityData } from '@mikro-orm/core';
import {
  NotFoundError,
  QueryOrder,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EntityService,
  OrgMemberDocParams,
  UserDocParams,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  shortenUuid,
  solrAppCollection,
  type AppConfig,
} from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  CreateUserDto,
  Keyword,
  OffsetAndLimit,
  UserRoleEnum,
  internalServerError,
  userEmailNotFound,
  userEmailTakenBadRequest,
  userIdNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { v4 } from 'uuid';
import type { UserAndOptions } from './interface';

/**
 * The service that interacts with the `UserEntity`.
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly entityService: EntityService,
    private readonly userInvitesService: UserInvitesService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * Creates a new `UserEntity` with the given information, adds the new user to Solr, and sends a verification email.
   *
   * @param createUserDto The information needed to create a new user.
   *
   * @returns A new `UserEntity` instance and a new `PublicKeyCredentialCreationOptionsJSON` for registering a new authenticator to the user, using WebAuthn.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM or Solr cli throws any other type of error.
   */
  async create(createUserDto: CreateUserDto): Promise<UserAndOptions> {
    const { email, name, displayName, phoneNumber } = createUserDto;
    const id = v4();
    const rpInfo = this.configService.get('rpInfo', { infer: true });

    let options: PublicKeyCredentialCreationOptionsJSON;
    try {
      options = await generateRegistrationOptions({
        rpName: rpInfo.name,
        rpID: rpInfo.id,
        userID: id,
        userName: email,
        userDisplayName: displayName ?? name,
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'required',
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const userInvites =
      await this.userInvitesService.findOrCreateOneByEmail(email);
    const user = new UserEntity(
      id,
      email,
      name,
      displayName,
      phoneNumber,
      options.challenge,
      UserRoleEnum.User,
      userInvites,
    );
    try {
      await this.em.persistAndFlush(user);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userEmailTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.addDocs(solrAppCollection, new UserDocParams(user));
    } catch (err) {
      this.logger.error(err);
      await this.em.removeAndFlush(user);
      throw new InternalServerErrorException(internalServerError);
    }

    await this.sendVerificationEmail(user);
    return { user, options };
  }

  /**
   * Finds the `UserEntity` in the database associated with the given ID.
   *
   * @param id The user ID to look for.
   *
   * @returns The associated `UserEntity` instance.
   * @throws {NotFoundException} `userIdNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneById(id: string): Promise<UserEntity> {
    try {
      return await this.em.findOneOrFail(UserEntity, id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(userIdNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `UserEntity` in the database associated with the given email.
   *
   * @param email The email to look for.
   *
   * @returns The associated `UserEntity` instance.
   * @throws {NotFoundException} `userEmailNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.em.findOneOrFail(UserEntity, { email });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(userEmailNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `UserEntity` in the database associated with the given email, return null if none is found.
   *
   * @param email The email to look for.
   *
   * @returns The associated `UserEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByEmailOrNull(email: string): Promise<UserEntity | null> {
    try {
      return await this.em.findOne(UserEntity, { email });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Gets all of the user entities.
   *
   * @param offsetAndLimit The offset and limit of the user to get.
   *
   * @returns A tuple containing the user entities and a count of the total number of users.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async getAllAndCount(
    offsetAndLimit: OffsetAndLimit,
  ): Promise<[UserEntity[], number]> {
    const { offset, limit } = offsetAndLimit;
    try {
      return await this.em.findAndCount(
        UserEntity,
        {},
        { offset, limit, orderBy: { role: QueryOrder.DESC } },
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the given `UserEntity` and saves the changes to the database.
   *
   * @param user The `UserEntity` instance to update.
   * @param data The new details for the user.
   *
   * @returns The updated `UserEntity` instance.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async update(
    user: UserEntity,
    data: EntityData<UserEntity>,
  ): Promise<UserEntity> {
    const updatedUser = this.em.assign(user, data);

    try {
      await this.em.flush();
      await this.em.populate(updatedUser, ['organizations']);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userEmailTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.getVersionAndReplaceDocs(
        solrAppCollection,
        new UserDocParams(updatedUser),
      );
      for (const orgMember of updatedUser.organizations) {
        await this.solrCli.getVersionAndReplaceDocs(
          orgMember.organization.id,
          new OrgMemberDocParams(orgMember),
        );
      }
    } catch (err) {
      this.logger.error(err);
    }

    return updatedUser;
  }

  /**
   * Deletes the given `UserEntity` and saves the changes to the database.
   *
   * @param user The `UserEntity` instance to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(user: UserEntity): Promise<void> {
    await this.entityService.safeToDelete(user);
    const userId = user.id;
    const collectionNamesAndIds: [string, string][] = user.organizations
      .getItems()
      .map((orgMember) => [orgMember.organization.id, orgMember.id]);

    try {
      await this.em.removeAndFlush(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.deleteDocs(solrAppCollection, { id: userId });
      for (const [collectionName, id] of collectionNamesAndIds) {
        await this.solrCli.deleteDocs(collectionName, { id });
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Send verification emails to the given users.
   *
   * @param users The users to send verification emails to.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the mailer or ORM throws an error.
   */
  async sendVerificationEmail(users: UserEntity | UserEntity[]): Promise<void> {
    const usersArray = Array.isArray(users) ? users : [users];
    const newbeeLink = this.configService.get('rpInfo.origin', { infer: true });
    const now = new Date();
    try {
      for (const user of usersArray) {
        const verifyLink = `${newbeeLink}/${Keyword.User}/${
          Keyword.Verify
        }/${shortenUuid(user.id)}`;
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Verify your NewBee email',
          text: `You must verify your email to keep using NewBee. Please click the link below to verify: ${verifyLink}`,
          html: `<p>You must verify your email to keep using NewBee. Please click the link below to verify: <a href="${verifyLink}">${verifyLink}</a></p>`,
        });
        this.em.assign(user, { verifyEmailLastSentAt: now });
      }

      await this.em.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Mark the user's email as verified.
   *
   * @param user The user to verify.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async verifyEmail(user: UserEntity): Promise<UserEntity> {
    const verifiedUser = this.em.assign(user, { emailVerified: true });
    try {
      await this.em.flush();
      return verifiedUser;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
