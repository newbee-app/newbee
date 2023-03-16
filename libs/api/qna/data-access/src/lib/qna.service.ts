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
import { elongateUuid } from '@newbee/api/shared/util';
import { internalServerError, qnaSlugNotFound } from '@newbee/shared/util';
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
    private readonly qnaRepository: EntityRepository<QnaEntity>
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
    const { title, questionMarkdown, answerMarkdown } = createQnaDto;
    const id = v4();
    const qna = new QnaEntity(
      id,
      title,
      creator,
      team,
      questionMarkdown,
      answerMarkdown
    );

    try {
      await this.qnaRepository.persistAndFlush(qna);
      return qna;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
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
    const now = new Date();
    const newQnaDetails = {
      ...updateQnaDto,
      updatedAt: now,
      markedUpToDateAt: now,
      upToDate: true,
      ...(newMaintainer && { maintainer: newMaintainer }),
    };
    const updatedQna = this.qnaRepository.assign(qna, newQnaDetails);
    try {
      await this.qnaRepository.flush();
      return updatedQna;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
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
      return updatedQna;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
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
  }
}
