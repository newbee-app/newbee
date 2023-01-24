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
import { OrganizationEntity, UserEntity } from '@newbee/api/shared/data-access';
import {
  internalServerError,
  organizationNameNotFound,
  organizationNameTakenBadRequest,
} from '@newbee/shared/util';
import { CreateOrganizationDto } from './dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

/**
 * The service that interacts with the `OrganizationEntity`.
 */
@Injectable()
export class OrganizationService {
  /**
   * The logger to use when logging anything in `OrganizationService`.
   */
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: EntityRepository<OrganizationEntity>
  ) {}

  /**
   * Creates a new `OrganizationEntity` and associates it with its relevant `ResourceEntity`, `UserOrganizationEntity`, `RoleEntity`, and `GrantEntity`.
   *
   * @param createOrganizationDto The information needed to create a new organization.
   * @param creator The `UserEntity` creating the organization.
   *
   * @returns A new `OrganizationEntity` instance.
   * @throws {BadRequestException} `organizationNameTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    createOrganizationDto: CreateOrganizationDto,
    creator: UserEntity
  ): Promise<OrganizationEntity> {
    const { name, displayName } = createOrganizationDto;
    const organization = new OrganizationEntity(name, creator, {
      ...(displayName && { displayName }),
    });

    try {
      await this.organizationRepository.persistAndFlush(organization);
      return organization;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(organizationNameTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `OrganizationEntity` in the database associated with the given name.
   *
   * @param name The name to look for.
   *
   * @returns The associated `OrganizationEntity` instance.
   * @throws {NotFoundException} `organizationNameNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByName(name: string): Promise<OrganizationEntity> {
    try {
      return await this.organizationRepository.findOneOrFail({ name });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(organizationNameNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the given `OrganizationEntity` and saves the changes to the database.
   *
   * @param organization The `OrganizationEntity` to update.
   * @param updateOrganizationDto The new details for the organization.
   *
   * @returns The updated `OrganizationEntity` instance.
   */
  async update(
    organization: OrganizationEntity,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationEntity> {
    const updatedOrganization = this.organizationRepository.assign(
      organization,
      updateOrganizationDto
    );
    try {
      await this.organizationRepository.flush();
      return updatedOrganization;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(organizationNameTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given `OrganizationEntity` and saves the changes to the database.
   *
   * @param organization The `OrganizationEntity` instance to delete.
   */
  async delete(organization: OrganizationEntity): Promise<void> {
    await this.organizationRepository.removeAndFlush(organization);
  }
}
