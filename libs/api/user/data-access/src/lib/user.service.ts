import {
  EntityRepository,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UserChallengeEntity,
  UserEntity,
  UserSettingsEntity,
} from '@newbee/api/shared/data-access';
import {
  AppConfigInterface,
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import type { UserAndOptions } from '@newbee/api/user/util';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { v4 } from 'uuid';
import { CreateUserDto, UpdateUserDto } from './dto';

/**
 * The service that interacts with the `UserEntity`.
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private readonly configService: ConfigService<AppConfigInterface, true>
  ) {}

  /**
   * Creates a new `UserEntity`, `UserChallengeEntity`, and `UserSettingsEntity` with the given information.
   *
   * @param createUserDto The information needed to create a new user.
   *
   * @returns A new `UserEntity` instance and a new `PublicKeyCredentialCreationOptionsJSON` for registering a new authenticator to the user, using WebAuthn.
   * @throws {BadRequestException} If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} If the ORM throws any other type of error.
   */
  async create(createUserDto: CreateUserDto): Promise<UserAndOptions> {
    const { email } = createUserDto;
    const id = v4();
    const { displayName, name } = createUserDto;
    const rpInfo = this.configService.get('rpInfo', { infer: true });
    const options = generateRegistrationOptions({
      rpName: rpInfo.name,
      rpID: rpInfo.id,
      userID: id,
      userName: email,
      userDisplayName: displayName ?? name,
    });

    const user = this.userRepository.create({
      ...createUserDto,
      id,
      settings: new UserSettingsEntity(),
      challenge: new UserChallengeEntity({ challenge: options.challenge }),
    });

    try {
      await this.userRepository.flush();
      return { user, options };
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          `The email ${email} is already taken, please use a different email or log in to your existing account.`
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  /**
   * Finds the `UserEntity` in the database associated with the given ID.
   *
   * @param id The user ID to look for.
   *
   * @returns The associated `UserEntity` instance.
   * @throws {NotFoundException} If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} If the ORM throws any other type of error.
   */
  async findOneById(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail(id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('a', 'user', 'an', 'ID', id)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  /**
   * Finds the `UserEntity` in the database associated with the given email.
   *
   * @param email The email to look for.
   *
   * @returns The associated `UserEntity` instance.
   * @throws {NotFoundException} If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} If the ORM throws any other type of error.
   */
  async findOneByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({ email });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('a', 'user', 'an', 'email', email)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  /**
   * Updates the given `UserEntity` and saves the changes to the database.
   *
   * @param user The `UserEntity` instance to update.
   * @param updateUserDto The new details for the user.
   *
   * @returns The updated `UserEntity` instance.
   */
  async update(
    user: UserEntity,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const updatedUser = this.userRepository.assign(user, updateUserDto);
    await this.userRepository.flush();
    return updatedUser;
  }

  /**
   * Deletes the given `UserEntity` and saves the changes to the database.
   *
   * @param user The `UserEntity` instance to delete.
   */
  async delete(user: UserEntity): Promise<void> {
    await this.userRepository.removeAndFlush(user);
  }
}
