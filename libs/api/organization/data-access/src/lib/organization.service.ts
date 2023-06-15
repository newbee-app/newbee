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
  EntityService,
  OrganizationEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { newOrgConfigset } from '@newbee/api/shared/util';
import {
  internalServerError,
  organizationSlugNotFound,
  organizationSlugTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import slugify from 'slug';
import { v4 } from 'uuid';
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
    private readonly organizationRepository: EntityRepository<OrganizationEntity>,
    private readonly entityService: EntityService,
    private readonly solrCli: SolrCli
  ) {}

  /**
   * Creates a new `OrganizationEntity` and makes the creator the owner.
   *
   * @param createOrganizationDto The information needed to create a new organization.
   * @param creator The `UserEntity` creating the organization.
   *
   * @returns A new `OrganizationEntity` instance.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    createOrganizationDto: CreateOrganizationDto,
    creator: UserEntity
  ): Promise<OrganizationEntity> {
    const { name, slug } = createOrganizationDto;
    const id = v4();
    const organization = new OrganizationEntity(id, name, slug, creator);

    try {
      await this.organizationRepository.persistAndFlush(organization);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(organizationSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.createCollection({
        name: id,
        numShards: 1,
        config: newOrgConfigset,
      });

      // Shouldn't execute as it's already initialized, but keep it here for safety
      if (!organization.members.isInitialized()) {
        await organization.members.init();
      }

      for (const orgMember of organization.members) {
        await this.solrCli.addDocs(
          id,
          await this.entityService.createOrgMemberDocParams(orgMember)
        );
      }
    } catch (err) {
      this.logger.error(err);
      await this.organizationRepository.removeAndFlush(organization);
      throw new InternalServerErrorException(internalServerError);
    }

    return organization;
  }

  /**
   * Whether an organization with the given slug already exists in the database.
   *
   * @param slug The slug to check for.
   *
   * @returns `true` if the slug already exists in the database, `false` if not.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async hasOneBySlug(slug: string): Promise<boolean> {
    try {
      return !!(await this.organizationRepository.findOne({ slug }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `OrganizationEntity` in the database associated with the given slug.
   *
   * @param slug The slug to look for.
   *
   * @returns The associated `OrganizationEntity` instance.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneBySlug(slug: string): Promise<OrganizationEntity> {
    try {
      return await this.organizationRepository.findOneOrFail({ slug });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(organizationSlugNotFound);
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
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async update(
    organization: OrganizationEntity,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationEntity> {
    const { slug } = updateOrganizationDto;
    if (slug) {
      updateOrganizationDto.slug = slugify(slug);
    }

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
        throw new BadRequestException(organizationSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given `OrganizationEntity` and saves the changes to the database.
   *
   * @param organization The `OrganizationEntity` instance to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(organization: OrganizationEntity): Promise<void> {
    const { id } = organization;
    await this.entityService.safeToDelete(organization);
    try {
      await this.organizationRepository.removeAndFlush(organization);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.deleteCollection(id);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
