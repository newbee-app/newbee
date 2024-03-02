import type { EntityData } from '@mikro-orm/core';
import {
  QueryOrder,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
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
  userEmailNotFound,
  userEmailTakenBadRequest,
  userIdNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { generateRegistrationOptions } from '@simplewebauthn/server';
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
    private readonly mailerService: MailerService,
    private readonly entityService: EntityService,
    private readonly userInvitesService: UserInvitesService,
  ) {}

  /**
   * Creates a new `UserEntity` with the given information, adds the new user to Solr, and sends a verification email.
   *
   * @param createUserDto The information needed to create a new user.
   *
   * @returns A new `UserEntity` instance and a new `PublicKeyCredentialCreationOptionsJSON` for registering a new authenticator to the user, using WebAuthn.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async create(createUserDto: CreateUserDto): Promise<UserAndOptions> {
    const { email, name, displayName, phoneNumber } = createUserDto;
    const userInvites =
      await this.userInvitesService.findOrCreateOneByEmail(email);
    const userAndOptions = await this.em.transactional(
      async (em): Promise<UserAndOptions> => {
        const id = v4();
        const rpInfo = this.configService.get('rpInfo', { infer: true });
        const options = await generateRegistrationOptions({
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
          await em.persistAndFlush(user);
        } catch (err) {
          if (err instanceof UniqueConstraintViolationException) {
            this.logger.error(err);
            throw new BadRequestException(userEmailTakenBadRequest);
          }

          throw err;
        }

        await this.solrCli.addDocs(solrAppCollection, new UserDocParams(user));
        return { user, options };
      },
    );

    try {
      await this.sendVerificationEmail(userAndOptions.user);
    } catch (err) {
      this.logger.error(err);
    }

    return userAndOptions;
  }

  /**
   * Finds the `UserEntity` in the database associated with the given ID.
   *
   * @param id The user ID to look for.
   *
   * @returns The associated `UserEntity` instance.
   * @throws {NotFoundException} `userIdNotFound`. If the user cannot be found.
   */
  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.em.findOne(UserEntity, id);
    if (!user) {
      throw new NotFoundException(userIdNotFound);
    }
    return user;
  }

  /**
   * Finds the `UserEntity` in the database associated with the given ID or `null` if it doesn't exist.
   *
   * @param id The user ID to look for.
   *
   * @returns The associated `UserEntity` instance or `null` if it doesn't exist.
   */
  async findOneByIdOrNull(id: string): Promise<UserEntity | null> {
    return await this.em.findOne(UserEntity, id);
  }

  /**
   * Finds the `UserEntity` in the database associated with the given email.
   *
   * @param email The email to look for.
   *
   * @returns The associated `UserEntity` instance.
   * @throws {NotFoundException} `userEmailNotFound`. If the user cannot be found.
   */
  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.em.findOne(UserEntity, { email });
    if (!user) {
      throw new NotFoundException(userEmailNotFound);
    }
    return user;
  }

  /**
   * Finds the `UserEntity` in the database associated with the given email, return null if none is found.
   *
   * @param email The email to look for.
   *
   * @returns The associated `UserEntity` instance.
   */
  async findOneByEmailOrNull(email: string): Promise<UserEntity | null> {
    return await this.em.findOne(UserEntity, { email });
  }

  /**
   * Gets all of the user entities.
   *
   * @param offsetAndLimit The offset and limit of the user to get.
   *
   * @returns A tuple containing the user entities and a count of the total number of users.
   */
  async getAllAndCount(
    offsetAndLimit: OffsetAndLimit,
  ): Promise<[UserEntity[], number]> {
    const { offset, limit } = offsetAndLimit;
    return await this.em.findAndCount(
      UserEntity,
      {},
      { offset, limit, orderBy: { role: QueryOrder.DESC } },
    );
  }

  /**
   * Updates the given `UserEntity` and saves the changes to the database.
   *
   * @param user The `UserEntity` instance to update.
   * @param data The new details for the user.
   *
   * @returns The updated `UserEntity` instance.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async update(
    user: UserEntity,
    data: EntityData<UserEntity>,
  ): Promise<UserEntity> {
    return await this.em.transactional(async (em): Promise<UserEntity> => {
      user = em.assign(user, data);
      try {
        await em.flush();
      } catch (err) {
        if (err instanceof UniqueConstraintViolationException) {
          this.logger.error(err);
          throw new BadRequestException(userEmailTakenBadRequest);
        }

        throw err;
      }

      await em.populate(user, ['organizations']);
      await this.solrCli.getVersionAndReplaceDocs(
        solrAppCollection,
        new UserDocParams(user),
      );
      for (const orgMember of user.organizations.getItems()) {
        await this.solrCli.getVersionAndReplaceDocs(
          orgMember.organization.id,
          new OrgMemberDocParams(orgMember),
        );
      }

      return user;
    });
  }

  /**
   * Deletes the given `UserEntity` and saves the changes to the database.
   *
   * @param user The `UserEntity` instance to delete.
   */
  async delete(user: UserEntity): Promise<void> {
    await this.entityService.safeToDelete(user);
    await this.em.transactional(async (em): Promise<void> => {
      const { id: userId } = user;
      await em.populate(user, ['organizations']);
      const collectionNamesAndIds: [string, string][] = user.organizations
        .getItems()
        .map((orgMember) => [orgMember.organization.id, orgMember.id]);
      await em.removeAndFlush(user);
      await this.solrCli.deleteDocs(solrAppCollection, { id: userId });
      for (const [collectionName, id] of collectionNamesAndIds) {
        await this.solrCli.deleteDocs(collectionName, { id });
      }
    });
  }

  /**
   * Send verification emails to the given users and update when a verify email was last sent.
   *
   * @param users The users to send verification emails to.
   *
   * @returns The users that were modified.
   */
  async sendVerificationEmail(
    users: UserEntity | UserEntity[],
  ): Promise<UserEntity[]> {
    const usersArr = Array.isArray(users) ? users : [users];
    const newbeeLink = this.configService.get('rpInfo.origin', { infer: true });
    const now = new Date();
    const changedUsers: UserEntity[] = [];
    for (const user of usersArr) {
      try {
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
        changedUsers.push(user);
      } catch (err) {
        this.logger.error(err);
        continue;
      }
    }

    if (changedUsers.length) {
      await this.em.flush();
    }

    return changedUsers;
  }

  /**
   * Mark the user's email as verified.
   *
   * @param user The user to verify.
   *
   * @returns The user whose email was just verified.
   */
  async verifyEmail(user: UserEntity): Promise<UserEntity> {
    user = this.em.assign(user, { emailVerified: true });
    await this.em.flush();
    return user;
  }
}
