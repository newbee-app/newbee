import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  DocDocParams,
  DocEntity,
  EntityService,
  OrgMemberEntity,
} from '@newbee/api/shared/data-access';
import { elongateUuid, renderMarkdoc } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  CreateDocDto,
  UpdateDocDto,
  docSlugNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';

/**
 * The service that interacts with the `DocEntity`.
 */
@Injectable()
export class DocService {
  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
    private readonly orgMemberService: OrgMemberService,
    private readonly teamService: TeamService,
  ) {}

  /**
   * Creates a new `DocEntity` and associates it with its relevant `OrganizationEntity` and `TeamEntity`, and marks the creator as the doc's creator and maintainer.
   *
   * @param createDocDto The information needed to create a new doc.
   * @param creator The user in the organization attempting to create the doc.
   *
   * @returns A new `DocEntity` instance.
   * @throws {NotFoundException} `teamSlugNotFound`. If the DTO specifies a team slug that cannot be found.
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
      ? await this.teamService.findOneByOrgAndSlug(
          creator.organization,
          teamSlug,
        )
      : null;

    return await this.em.transactional(async (em): Promise<DocEntity> => {
      const doc = new DocEntity(
        title,
        upToDateDuration,
        team,
        creator,
        docMarkdoc,
      );
      await em.persistAndFlush(doc);
      await this.solrCli.addDocs(
        creator.organization.id,
        new DocDocParams(doc),
      );
      return doc;
    });
  }

  /**
   * Finds the `DocEntity` associated with the given slug.
   *
   * @param slug The slug to look for.
   *
   * @returns The associated `DocEntity` instance, if one exists.
   * @throws {NotFoundException} `docSlugNotFound`. If the doc cannot be found.
   */
  async findOneBySlug(slug: string): Promise<DocEntity> {
    const id = elongateUuid(slug);
    const doc = await this.em.findOne(DocEntity, id);
    if (!doc) {
      throw new NotFoundException(docSlugNotFound);
    }
    return doc;
  }

  /**
   * Updates the given `DocEntity` and saves the changes.
   *
   * @param doc The `DocEntity` to update.
   * @param updateDocDto The new details for the doc.
   * @param orgMember The org member making the request.
   *
   * @returns The updated `DocEntity` instance.
   * @throws {NotFoundException} `teamSlugNotFound`, `orgMemberNotfound`. If the DTO specifies a team or an org member slug that cannot be found.
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
        ? await this.teamService.findOneByOrgAndSlug(doc.organization, teamSlug)
        : teamSlug;
    const maintainer =
      typeof maintainerSlug === 'string'
        ? await this.orgMemberService.findOneByOrgAndSlug(
            doc.organization,
            maintainerSlug,
          )
        : maintainerSlug;

    return await this.em.transactional(async (em): Promise<DocEntity> => {
      const { txt: docTxt, html: docHtml } = renderMarkdoc(docMarkdoc);
      const meaningfulUpdates = [title, docMarkdoc];
      const updateTime = meaningfulUpdates.some(
        (update) => update !== undefined,
      )
        ? new Date()
        : null;
      const trueUpToDateDuration = EntityService.trueUpToDateDuration(
        doc,
        upToDateDuration,
        team,
      );
      doc = em.assign(doc, {
        ...restUpdateDocDto,
        ...(docTxt !== undefined && { docTxt }),
        ...(docHtml !== undefined && { docHtml }),
        ...(team !== undefined && { team }),
        ...(maintainer !== undefined && { maintainer }),
        ...(updateTime && {
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
      await em.flush();
      await this.solrCli.getVersionAndReplaceDocs(
        doc.organization.id,
        new DocDocParams(doc),
      );
      return doc;
    });
  }

  /**
   * Marks the given `DocEntity` as up-to-date.
   *
   * @param doc The `DocEntity` to mark as up-to-date.
   *
   * @returns The updated `DocEntity` instance.
   */
  async markUpToDate(doc: DocEntity): Promise<DocEntity> {
    return await this.em.transactional(async (em): Promise<DocEntity> => {
      const now = new Date();
      doc = em.assign(doc, {
        markedUpToDateAt: now,
        outOfDateAt: dayjs(now)
          .add(EntityService.trueUpToDateDuration(doc, undefined, undefined))
          .toDate(),
      });
      await em.flush();
      await this.solrCli.getVersionAndReplaceDocs(
        doc.organization.id,
        new DocDocParams(doc),
      );
      return doc;
    });
  }

  /**
   * Deletes the given `DocEntity` and saves the changes.
   *
   * @param doc The `DocEntity` instance to delete.
   */
  async delete(doc: DocEntity): Promise<void> {
    await this.em.transactional(async (em): Promise<void> => {
      const { id } = doc;
      await em.removeAndFlush(doc);
      await this.solrCli.deleteDocs(doc.organization.id, { id });
    });
  }
}
