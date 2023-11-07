import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityService,
  OrgMemberEntity,
  QnaEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import { elongateUuid, renderMarkdoc } from '@newbee/api/shared/util';
import {
  internalServerError,
  nbDayjs,
  qnaSlugNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { v4 } from 'uuid';
import { CreateQnaDto, UpdateQnaDto } from './dto';

/**
 * The service that interacts with the `QnaEntity`.
 */
@Injectable()
export class QnaService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(QnaService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly entityService: EntityService,
    private readonly solrCli: SolrCli,
  ) {}

  /**
   * Creates a new `QnaEntity` and associates it with its relevant `OrganizationEntity` and `TeamEntity`, and marks the creator as the qna's creator.
   *
   * @param createQnaDto The information needed to create a new QnA.
   * @param team The team the QnA belongs to, if applicable.
   * @param creator The user in the organization attempting to create the QnA.
   *
   * @returns A new `QnaEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async create(
    createQnaDto: CreateQnaDto,
    team: TeamEntity | null,
    creator: OrgMemberEntity,
  ): Promise<QnaEntity> {
    const { title, questionMarkdoc, answerMarkdoc } = createQnaDto;
    const id = v4();
    const qna = new QnaEntity(
      id,
      title,
      team,
      creator,
      questionMarkdoc,
      answerMarkdoc,
    );

    try {
      await this.em.persistAndFlush(qna);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = creator.organization.id;
    try {
      await this.solrCli.addDocs(
        collectionName,
        this.entityService.createQnaDocParams(qna),
      );
    } catch (err) {
      this.logger.error(err);
      await this.em.removeAndFlush(qna);
      throw new InternalServerErrorException(internalServerError);
    }

    return qna;
  }

  /**
   * Finds the `QnaEntity` associated with the given slug.
   *
   * @param slug The slug to look for.
   *
   * @returns The associated `QnaEntity` instance, if one exists.
   * @throws {NotFoundException} `qnaSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneBySlug(slug: string): Promise<QnaEntity> {
    const id = elongateUuid(slug);
    try {
      return await this.em.findOneOrFail(QnaEntity, id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(qnaSlugNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Updates the given `QnaEntity` and saves the changes.
   *
   * @param qna The `QnaEntity` to update.
   * @param updateQnaDto The new details for the qna.
   * @param newMaintainer The new maintainer for the qna. Leave undefined to indicate that the maintainer should not be changed.
   *
   * @returns The updated `QnaEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async update(
    qna: QnaEntity,
    updateQnaDto: UpdateQnaDto,
    newMaintainer?: OrgMemberEntity,
  ): Promise<QnaEntity> {
    const { title, questionMarkdoc, answerMarkdoc, upToDateDuration } =
      updateQnaDto;

    const { txt: questionTxt, html: questionHtml } =
      renderMarkdoc(questionMarkdoc);
    const { txt: answerTxt, html: answerHtml } = renderMarkdoc(answerMarkdoc);

    const meaningfulUpdates = [title, questionMarkdoc, answerMarkdoc];
    const updateTime = meaningfulUpdates.some((update) => update !== undefined)
      ? new Date()
      : qna.markedUpToDateAt;
    const updatedQna = this.em.assign(qna, {
      ...updateQnaDto,
      ...(questionTxt !== undefined && { questionTxt }),
      ...(questionHtml !== undefined && { questionHtml }),
      ...(answerTxt !== undefined && { answerTxt }),
      ...(answerHtml !== undefined && { answerHtml }),
      ...(newMaintainer && { maintainer: newMaintainer }),
      updatedAt: updateTime,
      markedUpToDateAt: updateTime,
      outOfDateAt: nbDayjs(updateTime)
        .add(
          upToDateDuration
            ? nbDayjs.duration(upToDateDuration)
            : await qna.trueUpToDateDuration(),
        )
        .toDate(),
    });

    try {
      await this.em.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = qna.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        this.entityService.createQnaDocParams(updatedQna),
      );
    } catch (err) {
      this.logger.error(err);
    }

    return updatedQna;
  }

  /**
   * Marks the given `QnaEntity` as up-to-date.
   *
   * @param qna The `QnaEntity` instance.
   *
   * @returns The updated `QnaEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async markUpToDate(qna: QnaEntity): Promise<QnaEntity> {
    const now = new Date();
    const updatedQna = this.em.assign(qna, {
      markedUpToDateAt: now,
      outOfDateAt: nbDayjs(now)
        .add(await qna.trueUpToDateDuration())
        .toDate(),
    });

    try {
      await this.em.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = qna.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        this.entityService.createQnaDocParams(updatedQna),
      );
    } catch (err) {
      this.logger.error(err);
    }

    return updatedQna;
  }

  /**
   * Deletes the given `QnaEntity` and saves the changes.
   *
   * @param qna The `QnaEntity` instance to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(qna: QnaEntity): Promise<void> {
    const collectionName = qna.organization.id;
    const { id } = qna;
    await this.entityService.safeToDelete(qna);

    try {
      await this.em.removeAndFlush(qna);
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
