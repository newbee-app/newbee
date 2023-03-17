import { NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DocEntity,
  OrgMemberEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import type { SolrSchema } from '@newbee/api/shared/util';
import { elongateUuid, SolrEntryEnum } from '@newbee/api/shared/util';
import { docSlugNotFound, internalServerError } from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { v4 } from 'uuid';
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
    private readonly docRepository: EntityRepository<DocEntity>,
    private readonly solrCli: SolrCli
  ) {}

  /**
   * Creates a new `DocEntity` and associates it with its relevant `OrganizationEntity` and `TeamEntity`, and marks the creator as the doc's creator and maintainer.
   *
   * @param createDocDto The information needed to create a new doc.
   * @param team The team the doc belongs to, if applicable.
   * @param creator The user in the organization attempting to create the doc.
   *
   * @returns A new `DocEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async create(
    createDocDto: CreateDocDto,
    team: TeamEntity | null,
    creator: OrgMemberEntity
  ): Promise<DocEntity> {
    const { title, rawMarkdown } = createDocDto;
    const id = v4();
    const doc = new DocEntity(id, title, creator, team, rawMarkdown);

    try {
      await this.docRepository.persistAndFlush(doc);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = creator.organization.id;
    try {
      await this.solrCli.addDocs(
        collectionName,
        DocService.createDocFields(doc)
      );
    } catch (err) {
      this.logger.error(err);
      await this.docRepository.removeAndFlush(doc);
      throw new InternalServerErrorException(internalServerError);
    }

    return doc;
  }

  /**
   * Finds the `DocEntity` associated with the given slug.
   *
   * @param slug The slug to look for.
   *
   * @returns The associated `DocEntity` instance, if one exists.
   * @throws {NotFoundException} `docSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneBySlug(slug: string): Promise<DocEntity> {
    const id = elongateUuid(slug);
    try {
      return await this.docRepository.findOneOrFail(id);
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
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async update(doc: DocEntity, updateDocDto: UpdateDocDto): Promise<DocEntity> {
    const now = new Date();
    const newDocDetails = {
      ...updateDocDto,
      updatedAt: now,
      markedUpToDateAt: now,
      upToDate: true,
    };
    const updatedDoc = this.docRepository.assign(doc, newDocDetails);
    try {
      await this.docRepository.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = doc.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        DocService.createDocFields(updatedDoc)
      );
    } catch (err) {
      this.logger.error(err);
    }

    return updatedDoc;
  }

  /**
   * Marks the given `DocEntity` as up-to-date.
   *
   * @param doc The `DocEntity` to mark as up-to-date.
   *
   * @returns The updated `DocEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async markUpToDate(doc: DocEntity): Promise<DocEntity> {
    const now = new Date();
    const newDocDetails = { markedUpToDateAt: now, upToDate: true };
    const updatedDoc = this.docRepository.assign(doc, newDocDetails);
    try {
      await this.docRepository.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = doc.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        DocService.createDocFields(updatedDoc)
      );
    } catch (err) {
      this.logger.error(err);
    }

    return updatedDoc;
  }

  /**
   * Deletes the given `DocEntity` and saves the changes.
   *
   * @param doc The `DocEntity` instance to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(doc: DocEntity): Promise<void> {
    try {
      await this.docRepository.removeAndFlush(doc);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = doc.organization.id;
    try {
      await this.solrCli.deleteDocs(collectionName, { id: doc.id });
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Create the fields to add or replace a doc doc in a Solr index.
   *
   * @param doc The doc to create doc fields for.
   *
   * @returns The params to add or replace a doc using SolrCli.
   */
  private static createDocFields(doc: DocEntity): SolrSchema {
    const {
      id,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      upToDate,
      title,
      creator,
      maintainer,
      rawMarkdown,
      team,
    } = doc;
    return {
      id,
      entry_type: SolrEntryEnum.Doc,
      created_at: createdAt,
      updated_at: updatedAt,
      marked_up_to_date_at: markedUpToDateAt,
      up_to_date: upToDate,
      title,
      creator: creator.id,
      maintainer: maintainer?.id ?? null,
      doc_body: rawMarkdown,
      team: team?.id ?? null,
    };
  }
}
