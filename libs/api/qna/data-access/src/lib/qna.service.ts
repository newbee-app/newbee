import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  EntityService,
  OrgMemberEntity,
  QnaDocParams,
  QnaEntity,
} from '@newbee/api/shared/data-access';
import { elongateUuid, renderMarkdoc } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  CreateQnaDto,
  UpdateQnaDto,
  qnaSlugNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';

/**
 * The service that interacts with the `QnaEntity`.
 */
@Injectable()
export class QnaService {
  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
    private readonly teamService: TeamService,
    private readonly orgMemberService: OrgMemberService,
  ) {}

  /**
   * Creates a new `QnaEntity` and associates it with its relevant `OrganizationEntity` and `TeamEntity`, and marks the creator as the qna's creator.
   *
   * @param createQnaDto The information needed to create a new QnA.
   * @param creator The user in the organization attempting to create the QnA.
   *
   * @returns A new `QnaEntity` instance.
   */
  async create(
    createQnaDto: CreateQnaDto,
    creator: OrgMemberEntity,
  ): Promise<QnaEntity> {
    const {
      title,
      questionMarkdoc,
      answerMarkdoc,
      team: teamSlug,
    } = createQnaDto;

    const team = teamSlug
      ? await this.teamService.findOneByOrgAndSlug(
          creator.organization,
          teamSlug,
        )
      : null;

    return await this.em.transactional(async (em): Promise<QnaEntity> => {
      const qna = new QnaEntity(
        title,
        team,
        creator,
        questionMarkdoc,
        answerMarkdoc,
      );
      await em.persistAndFlush(qna);
      await this.solrCli.addDocs(
        creator.organization.id,
        new QnaDocParams(qna),
      );
      return qna;
    });
  }

  /**
   * Finds the `QnaEntity` associated with the given slug.
   *
   * @param slug The slug to look for.
   *
   * @returns The associated `QnaEntity` instance, if one exists.
   * @throws {NotFoundException} `qnaSlugNotFound`. If the qna cannot be found.
   */
  async findOneBySlug(slug: string): Promise<QnaEntity> {
    const id = elongateUuid(slug);
    const qna = await this.em.findOne(QnaEntity, id);
    if (!qna) {
      throw new NotFoundException(qnaSlugNotFound);
    }
    return qna;
  }

  /**
   * Updates the given `QnaEntity` and saves the changes.
   *
   * @param qna The `QnaEntity` to update.
   * @param updateQnaDto The new details for the qna.
   * @param newMaintainer The new maintainer for the qna. Leave undefined to indicate that the maintainer should not be changed.
   *
   * @returns The updated `QnaEntity` instance.
   */
  async update(qna: QnaEntity, updateQnaDto: UpdateQnaDto): Promise<QnaEntity> {
    const {
      team: teamSlug,
      maintainer: maintainerSlug,
      ...restUpdateQnaDto
    } = updateQnaDto;
    const { title, questionMarkdoc, answerMarkdoc, upToDateDuration } =
      restUpdateQnaDto;

    const team =
      typeof teamSlug === 'string'
        ? await this.teamService.findOneByOrgAndSlug(qna.organization, teamSlug)
        : teamSlug;
    const maintainer =
      typeof maintainerSlug === 'string'
        ? await this.orgMemberService.findOneByOrgAndSlug(
            qna.organization,
            maintainerSlug,
          )
        : maintainerSlug;

    return await this.em.transactional(async (em): Promise<QnaEntity> => {
      const { txt: questionTxt, html: questionHtml } =
        renderMarkdoc(questionMarkdoc);
      const { txt: answerTxt, html: answerHtml } = renderMarkdoc(answerMarkdoc);

      const meaningfulUpdates = [title, questionMarkdoc, answerMarkdoc];
      const updateTime = meaningfulUpdates.some(
        (update) => update !== undefined,
      )
        ? new Date()
        : null;
      const trueUpToDateDuration = EntityService.trueUpToDateDuration(
        qna,
        upToDateDuration,
        team,
      );
      qna = em.assign(qna, {
        ...restUpdateQnaDto,
        ...(questionTxt !== undefined && { questionTxt }),
        ...(questionHtml !== undefined && { questionHtml }),
        ...(answerTxt !== undefined && { answerTxt }),
        ...(answerHtml !== undefined && { answerHtml }),
        ...(team !== undefined && { team }),
        ...(maintainer !== undefined && { maintainer }),
        ...(updateTime && {
          markedUpToDateAt: updateTime,
          outOfDateAt: dayjs(updateTime).add(trueUpToDateDuration).toDate(),
        }),
        ...(!updateTime &&
          (upToDateDuration !== undefined || team !== undefined) && {
            outOfDateAt: dayjs(qna.markedUpToDateAt)
              .add(trueUpToDateDuration)
              .toDate(),
          }),
      });
      await em.flush();
      await this.solrCli.getVersionAndReplaceDocs(
        qna.organization.id,
        new QnaDocParams(qna),
      );
      return qna;
    });
  }

  /**
   * Marks the given `QnaEntity` as up-to-date.
   *
   * @param qna The `QnaEntity` instance.
   *
   * @returns The updated `QnaEntity` instance.
   */
  async markUpToDate(qna: QnaEntity): Promise<QnaEntity> {
    return await this.em.transactional(async (em): Promise<QnaEntity> => {
      const now = new Date();
      qna = em.assign(qna, {
        markedUpToDateAt: now,
        outOfDateAt: dayjs(now)
          .add(EntityService.trueUpToDateDuration(qna, undefined, undefined))
          .toDate(),
      });
      await em.flush();
      await this.solrCli.getVersionAndReplaceDocs(
        qna.organization.id,
        new QnaDocParams(qna),
      );
      return qna;
    });
  }

  /**
   * Deletes the given `QnaEntity` and saves the changes.
   *
   * @param qna The `QnaEntity` instance to delete.
   */
  async delete(qna: QnaEntity): Promise<void> {
    await this.em.transactional(async (em): Promise<void> => {
      const { id } = qna;
      await em.removeAndFlush(qna);
      await this.solrCli.deleteDocs(qna.organization.id, { id });
    });
  }
}
