import type { EntityData } from '@mikro-orm/core';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityService, UserEntity } from '@newbee/api/shared/data-access';
import type { AppConfig } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  internalServerError,
  userEmailNotFound,
  userEmailTakenBadRequest,
  userIdNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto';
import type { UserAndOptions } from './interface';

/**
 * The service that interacts with the `UserEntity`.
 */
@Injectable()
export class UserService {
  /**
   * The logger to use when logging anything in `UserService`.
   */
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private readonly entityService: EntityService,
    private readonly userInvitesService: UserInvitesService,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly solrCli: SolrCli
  ) {}

  /**
   * Creates a new `UserEntity`, `UserChallengeEntity`, and `UserSettingsEntity` with the given information.
   *
   * @param createUserDto The information needed to create a new user.
   * @returns A new `UserEntity` instance and a new `PublicKeyCredentialCreationOptionsJSON` for registering a new authenticator to the user, using WebAuthn.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(createUserDto: CreateUserDto): Promise<UserAndOptions> {
    const { email, displayName, name, phoneNumber } = createUserDto;
    const userInvites = await this.userInvitesService.findOrCreateOneByEmail(
      email
    );
    const id = v4();
    const rpInfo = this.configService.get('rpInfo', { infer: true });
    const options = generateRegistrationOptions({
      rpName: rpInfo.name,
      rpID: rpInfo.id,
      userID: id,
      userName: email,
      userDisplayName: displayName ?? name,
    });
    const user = new UserEntity(
      id,
      email,
      name,
      displayName,
      phoneNumber,
      options.challenge,
      userInvites
    );
    try {
      await this.userRepository.persistAndFlush(user);
      return { user, options };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userEmailTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
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
      return await this.userRepository.findOneOrFail(id);
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
      return await this.userRepository.findOneOrFail({ email });
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
      return await this.userRepository.findOne({ email });
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
    data: EntityData<UserEntity>
  ): Promise<UserEntity> {
    const updatedUser = this.userRepository.assign(user, data);

    try {
      await this.userRepository.flush();
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userEmailTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    if (!data.name && !data.displayName) {
      return updatedUser;
    }

    const { organizations } = updatedUser;
    if (!organizations.isInitialized()) {
      await organizations.init();
    }
    for (const orgMember of organizations) {
      const { organization } = orgMember;
      try {
        await this.solrCli.getVersionAndReplaceDocs(
          organization.id,
          await this.entityService.createOrgMemberDocParams(orgMember)
        );
      } catch (err) {
        this.logger.error(err);
      }
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
    const collectionNamesAndIds: [string, string][] = [];
    try {
      await this.userRepository.populate(user, ['organizations']);
      collectionNamesAndIds.push(
        ...user.organizations
          .getItems()
          .map(
            (orgMember) =>
              [orgMember.organization.id, orgMember.slug] as [string, string]
          )
      );

      await this.entityService.prepareToDelete(user);
      await this.userRepository.removeAndFlush(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    try {
      for (const [collectionName, id] of collectionNamesAndIds) {
        await this.solrCli.deleteDocs(collectionName, { id });
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
