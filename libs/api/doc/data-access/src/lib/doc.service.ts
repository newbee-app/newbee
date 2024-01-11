import { NotFoundError, QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  DocDocParams,
  DocEntity,
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
} from '@newbee/api/shared/data-access';
import { elongateUuid, renderMarkdoc } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import { docSlugNotFound, internalServerError } from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
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
    private readonly teamService: TeamService,
    private readonly orgMemberService: OrgMemberService,
  ) {}

  /**
   * Creates a new `DocEntity` and associates it with its relevant `OrganizationEntity` and `TeamEntity`, and marks the creator as the doc's creator and maintainer.
   *
   * @param createDocDto The information needed to create a new doc.
   * @param creator The user in the organization attempting to create the doc.
   *
   * @returns A new `DocEntity` instance.
   * @throws {NotFoundException} `teamSlugNotFound`. If the DTO specifies a team slug that cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async create(
    createDocDto: CreateDocDto,
    creator: OrgMemberEntity,
  ): Promise<DocEntity> {
    const {
      title,
      upToDateDuration,
      docMarkdoc,
      team: teamSlug,
    } = createDocDto;

    const team = teamSlug
      ? await this.teamService.findOneBySlug(creator.organization, teamSlug)
      : null;

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
      await this.solrCli.addDocs(collectionName, new DocDocParams(doc));
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
   * Finds all of the `DocEntity` associated with the given org.
   *
   * @param organization The organization whose docs to look for.
   * @param offset The offset to look for.
   *
   * @returns A tuple containing the found doc entities and a count of the total number of docs in the org.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async findByOrgAndCount(
    organization: OrganizationEntity,
    offset: number,
  ): Promise<[DocEntity[], number]> {
    try {
      return await this.em.findAndCount(
        DocEntity,
        { organization },
        { orderBy: { markedUpToDateAt: QueryOrder.DESC }, limit: 20, offset },
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the given `DocEntity` and saves the changes.
   *
   * @param doc The `DocEntity` to update.
   * @param updateDocDto The new details for the doc.
   * @param orgMember The org member making the request.
   *
   * @returns The updated `DocEntity` instance.
   * @throws {NotFoundException} `teamSlugNotFound`. If the DTO specifies a team slug that cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async update(doc: DocEntity, updateDocDto: UpdateDocDto): Promise<DocEntity> {
    const {
      team: teamSlug,
      maintainer: maintainerSlug,
      ...restUpdateDocDto
    } = updateDocDto;
    const { title, docMarkdoc, upToDateDuration } = restUpdateDocDto;

    const team =
      typeof teamSlug === 'string'
        ? await this.teamService.findOneBySlug(doc.organization, teamSlug)
        : teamSlug;
    const maintainer =
      typeof maintainerSlug === 'string'
        ? await this.orgMemberService.findOneByOrgAndSlug(
            doc.organization,
            maintainerSlug,
          )
        : maintainerSlug;

    const { txt: docTxt, html: docHtml } = renderMarkdoc(docMarkdoc);

    const meaningfulUpdates = [title, docMarkdoc];
    const updateTime = meaningfulUpdates.some((update) => update !== undefined)
      ? new Date()
      : null;
    const trueUpToDateDuration = EntityService.trueUpToDateDuration(
      doc,
      upToDateDuration,
      team,
    );
    const updatedDoc = this.em.assign(doc, {
      ...restUpdateDocDto,
      ...(docTxt !== undefined && { docTxt }),
      ...(docHtml !== undefined && { docHtml }),
      ...(team !== undefined && { team }),
      ...(maintainer !== undefined && { maintainer }),
      ...(updateTime && {
        updatedAt: updateTime,
        markedUpToDateAt: updateTime,
        outOfDateAt: dayjs(updateTime).add(trueUpToDateDuration).toDate(),
      }),
      ...(!updateTime &&
        (upToDateDuration !== undefined || team !== undefined) && {
          outOfDateAt: dayjs(doc.markedUpToDateAt)
            .add(trueUpToDateDuration)
            .toDate(),
        }),
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
        new DocDocParams(updatedDoc),
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
      outOfDateAt: dayjs(now)
        .add(EntityService.trueUpToDateDuration(doc, undefined, undefined))
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
        new DocDocParams(updatedDoc),
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
