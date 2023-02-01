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
  DocEntity,
  OrganizationEntity,
  OrgMemberEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import {
  docSlugNotFound,
  docSlugTakenBadRequest,
  internalServerError,
} from '@newbee/shared/util';
import { CreateDocDto, UpdateDocDto } from './dto';

/**
 * The service that interacts with the `DocEntity`.
 */
@Injectable()
export class DocService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(DocService.name);

  constructor(
    @InjectRepository(DocEntity)
    private readonly docRepository: EntityRepository<DocEntity>
  ) {}

  /**
   * Creates a new `DocEntity` and associates it with its relevant `OrganizationEntity` and `TeamEntity`, and marks the creator as the doc's creator and maintainer.
   *
   * @param createDocDto The information needed to create a new doc.
   * @param team The team the doc belongs to, if applicable.
   * @param creator The user in the organization attempting to create the doc.
   *
   * @returns A new `DocEntity` instance.
   * @throws {BadRequestException} `docSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    createDocDto: CreateDocDto,
    team: TeamEntity | null,
    creator: OrgMemberEntity
  ): Promise<DocEntity> {
    const { slug, rawMarkdown } = createDocDto;
    const doc = new DocEntity(creator, team, slug, rawMarkdown);

    try {
      await this.docRepository.persistAndFlush(doc);
      return doc;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(docSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `DocEntity` associated with the given slug in the given organization.
   *
   * @param organization The organization to look in.
   * @param slug The slug to look for.
   *
   * @returns The associated `DocEntity` instance, if one exists.
   * @throws {NotFoundException} `docSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneBySlug(
    organization: OrganizationEntity,
    slug: string
  ): Promise<DocEntity> {
    try {
      return await this.docRepository.findOneOrFail({ organization, slug });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(docSlugNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the given `DocEntity` and saves the changes.
   *
   * @param doc The `DocEntity` to update.
   * @param updateDocDto The new details for the doc.
   *
   * @returns The updated `DocEntity` instance.
   * @throws {BadRequestException} `docSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async update(doc: DocEntity, updateDocDto: UpdateDocDto): Promise<DocEntity> {
    const updatedDoc = this.docRepository.assign(doc, updateDocDto);
    try {
      await this.docRepository.flush();
      return updatedDoc;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(docSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given `DocEntity` and saves the changes.
   *
   * @param doc The `DocEntity` instance to delete.
   */
  async delete(doc: DocEntity): Promise<void> {
    await this.docRepository.removeAndFlush(doc);
  }
}
