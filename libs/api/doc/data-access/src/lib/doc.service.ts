import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DocEntity,
  EntityService,
  OrgMemberEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import { elongateUuid, renderMarkdoc } from '@newbee/api/shared/util';
import {
  docSlugNotFound,
  internalServerError,
  nbDayjs,
} from '@newbee/shared/util';
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
    private readonly em: EntityManager,
    private readonly entityService: EntityService,
    private readonly solrCli: SolrCli,
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
    creator: OrgMemberEntity,
  ): Promise<DocEntity> {
    const { title, upToDateDuration, docMarkdoc } = createDocDto;
    const id = v4();
    const doc = new DocEntity(
      id,
      title,
      upToDateDuration,
      team,
      creator,
      docMarkdoc,
    );

    try {
      await this.em.persistAndFlush(doc);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = creator.organization.id;
    try {
      await this.solrCli.addDocs(
        collectionName,
        this.entityService.createDocDocParams(doc),
      );
    } catch (err) {
      this.logger.error(err);
      await this.em.removeAndFlush(doc);
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
      return await this.em.findOneOrFail(DocEntity, id);
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
    const { title, docMarkdoc, upToDateDuration } = updateDocDto;

    const { txt: docTxt, html: docHtml } = renderMarkdoc(docMarkdoc);

    const updateTime =
      title !== undefined || docMarkdoc !== undefined
        ? new Date()
        : doc.markedUpToDateAt;
    const updatedDoc = this.em.assign(doc, {
      ...updateDocDto,
      ...(docTxt !== undefined && { docTxt }),
      ...(docHtml !== undefined && { docHtml }),
      updatedAt: updateTime,
      markedUpToDateAt: updateTime,
      outOfDateAt: nbDayjs(updateTime)
        .add(
          upToDateDuration
            ? nbDayjs.duration(upToDateDuration)
            : await doc.trueUpToDateDuration(),
        )
        .toDate(),
    });

    try {
      await this.em.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = doc.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        this.entityService.createDocDocParams(updatedDoc),
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
    const updatedDoc = this.em.assign(doc, {
      markedUpToDateAt: now,
      outOfDateAt: nbDayjs(now)
        .add(await doc.trueUpToDateDuration())
        .toDate(),
    });

    try {
      await this.em.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = doc.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        this.entityService.createDocDocParams(updatedDoc),
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
    const collectionName = doc.organization.id;
    const { id } = doc;
    await this.entityService.safeToDelete(doc);

    try {
      await this.em.removeAndFlush(doc);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.deleteDocs(collectionName, { id });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
