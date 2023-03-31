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
import { UserAndOptionsDto, UserEntity } from '@newbee/api/shared/data-access';
import type { AppConfig, SolrSchema } from '@newbee/api/shared/util';
import {
  internalServerError,
  SolrEntryEnum,
  userEmailNotFound,
  userEmailTakenBadRequest,
  userIdNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { v4 } from 'uuid';
import { CreateUserDto, UpdateUserDto } from './dto';

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
  async create(createUserDto: CreateUserDto): Promise<UserAndOptionsDto> {
    const { email, displayName, name, phoneNumber } = createUserDto;
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
      options.challenge
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
   * Updates the given `UserEntity` and saves the changes to the database.
   *
   * @param user The `UserEntity` instance to update.
   * @param updateUserDto The new details for the user.
   *
   * @returns The updated `UserEntity` instance.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async update(
    user: UserEntity,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const updatedUser = this.userRepository.assign(user, updateUserDto);

    try {
      await this.userRepository.flush();
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userEmailTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    if (!updateUserDto.name && !updateUserDto.displayName) {
      return updatedUser;
    }

    if (!updatedUser.organizations.isInitialized()) {
      await updatedUser.organizations.init();
    }
    const { name, displayName, organizations } = updatedUser;
    for (const orgMember of organizations) {
      const { organization, slug } = orgMember;
      const docFields: SolrSchema = {
        id: `${updatedUser.id},${organization.id}`,
        entry_type: SolrEntryEnum.User,
        slug,
        user_name: name,
        user_display_name: displayName,
      };
      try {
        await this.solrCli.getVersionAndReplaceDocs(organization.id, docFields);
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
    try {
      await user.removeAllCollections();
      await this.userRepository.removeAndFlush(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
