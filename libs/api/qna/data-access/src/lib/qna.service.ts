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
  OrgMemberEntity,
  QnaEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import {
  elongateUuid,
  markdocToTxt,
  SolrSchema,
} from '@newbee/api/shared/util';
import {
  internalServerError,
  qnaSlugNotFound,
  SolrEntryEnum,
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
    @InjectRepository(QnaEntity)
    private readonly qnaRepository: EntityRepository<QnaEntity>,
    private readonly solrCli: SolrCli
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
    creator: OrgMemberEntity
  ): Promise<QnaEntity> {
    const { title, questionMarkdoc, answerMarkdoc } = createQnaDto;
    const id = v4();
    const qna = new QnaEntity(
      id,
      title,
      creator,
      team,
      questionMarkdoc,
      answerMarkdoc
    );

    try {
      await this.qnaRepository.persistAndFlush(qna);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = creator.organization.id;
    try {
      await this.solrCli.addDocs(
        collectionName,
        QnaService.createDocFields(qna)
      );
    } catch (err) {
      this.logger.error(err);
      await this.qnaRepository.removeAndFlush(qna);
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
      return await this.qnaRepository.findOneOrFail(id);
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
    newMaintainer?: OrgMemberEntity
  ): Promise<QnaEntity> {
    const { questionMarkdoc, answerMarkdoc } = updateQnaDto;
    const now = new Date();
    const newQnaDetails = {
      ...updateQnaDto,
      ...(questionMarkdoc && { questionTxt: markdocToTxt(questionMarkdoc) }),
      ...(answerMarkdoc && { answerTxt: markdocToTxt(answerMarkdoc) }),
      ...(newMaintainer && { maintainer: newMaintainer }),
      updatedAt: now,
      markedUpToDateAt: now,
      upToDate: true,
    };
    const updatedQna = this.qnaRepository.assign(qna, newQnaDetails);
    try {
      await this.qnaRepository.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = qna.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        QnaService.createDocFields(updatedQna)
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
    const newQnaDetails = { markedUpToDateAt: now, upToDate: true };
    const updatedQna = this.qnaRepository.assign(qna, newQnaDetails);
    try {
      await this.qnaRepository.flush();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = qna.organization.id;
    try {
      await this.solrCli.getVersionAndReplaceDocs(
        collectionName,
        QnaService.createDocFields(updatedQna)
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
    try {
      await this.qnaRepository.removeAndFlush(qna);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = qna.organization.id;
    try {
      await this.solrCli.deleteDocs(collectionName, { id: qna.id });
    } catch (err) {
      this.logger.error(err);
    }
  }

  private static createDocFields(qna: QnaEntity): SolrSchema {
    const {
      id,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      upToDate,
      title,
      slug,
      creator,
      maintainer,
      questionTxt,
      answerTxt,
      team,
    } = qna;
    return {
      id,
      entry_type: SolrEntryEnum.Qna,
      slug,
      created_at: createdAt,
      updated_at: updatedAt,
      marked_up_to_date_at: markedUpToDateAt,
      up_to_date: upToDate,
      qna_title: title,
      creator: creator.slug,
      maintainer: maintainer?.slug ?? null,
      question_txt: questionTxt,
      answer_txt: answerTxt,
      team: team?.id ?? null,
    };
  }
}
