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
  QnaEntity,
  TeamEntity,
  UserOrganizationEntity,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  qnaSlugNotFound,
  qnaSlugTakenBadRequest,
} from '@newbee/shared/util';
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
   * Creates a new `QnaEntity` and associates it with its relevant `ResourceEntity`, `RoleEntity`, `GrantEntity`, `OrganizationEntity`, and `TeamEntity`.
   *
   * @param createQnaDto The information needed to create a new QnA.
   * @param team The team the QnA belongs to, if applicable.
   * @param creator The user in the organization attempting to create the QnA.
   *
   * @returns A new `QnaEntity` instance.
   * @throws {BadRequestException} `qnaSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    createQnaDto: CreateQnaDto,
    team: TeamEntity | null,
    creator: UserOrganizationEntity
  ): Promise<QnaEntity> {
    const { slug, questionMarkdown, answerMarkdown } = createQnaDto;
    const qna = new QnaEntity(
      team,
      slug,
      questionMarkdown,
      answerMarkdown,
      creator
    );

    try {
      await this.qnaRepository.persistAndFlush(qna);
      return qna;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(qnaSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `QnaEntity` associated with the given slug in the given organization.
   *
   * @param organization The organization to look in.
   * @param slug The slug to look for.
   *
   * @returns The associated `QnaEntity` instance, if one exists.
   * @throws {NotFoundException} `qnaSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findBySlug(
    organization: OrganizationEntity,
    slug: string
  ): Promise<QnaEntity> {
    try {
      return await this.qnaRepository.findOneOrFail({ organization, slug });
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
   *
   * @returns The updated `QnaEntity` instance.
   * @throws {BadRequestException} `qnSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async update(qna: QnaEntity, updateQnaDto: UpdateQnaDto): Promise<QnaEntity> {
    const updatedQna = this.qnaRepository.assign(qna, updateQnaDto);
    try {
      await this.qnaRepository.flush();
      return updatedQna;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(qnaSlugTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given `QnaEntity` and saves the changes.
   *
   * @param qna The `QnaEntity` instance to delete.
   */
  async delete(qna: QnaEntity): Promise<void> {
    await this.qnaRepository.removeAndFlush(qna);
  }
}
