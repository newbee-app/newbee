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
import {
  OrganizationEntity,
  UserEntity,
  UserOrganizationEntity,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  userAlreadyInOrganizationBadRequest,
  userOrganizationNotFound,
} from '@newbee/shared/util';

/**
 * The service that interacts with `UserOrganizationEntity`.
 */
@Injectable()
export class UserOrganizationService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(UserOrganizationService.name);

  constructor(
    @InjectRepository(UserOrganizationEntity)
    private readonly userOrganizationRepository: EntityRepository<UserOrganizationEntity>
  ) {}

  /**
   * Creates a new `UserOrganizationEntity` using the given `UserEntity` and `OrganizationEntity`.
   *
   * @param user The `UserEntity` to associate.
   * @param organization The `OrganizationEntity` to associate.
   *
   * @returns A new `UserOrganizationEntity` instance.
   * @throws {BadRequestException} `userAlreadyInOrganizationBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    user: UserEntity,
    organization: OrganizationEntity
  ): Promise<UserOrganizationEntity> {
    const userOrganization = new UserOrganizationEntity(user, organization);
    try {
      await this.userOrganizationRepository.persistAndFlush(userOrganization);
      return userOrganization;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userAlreadyInOrganizationBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `UserOrganizationEntity` associated with the given user and organization.
   *
   * @param user The user to search for.
   * @param organization The organization to search in.
   *
   * @returns The associated `UserOrganizationEntity` instance.
   * @throws {NotFoundException} `userOrganizationNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByUserAndOrganization(
    user: UserEntity,
    organization: OrganizationEntity
  ): Promise<UserOrganizationEntity> {
    try {
      return await this.userOrganizationRepository.findOneOrFail({
        user,
        organization,
      });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(userOrganizationNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }
}
