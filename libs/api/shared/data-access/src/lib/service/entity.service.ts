import { QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type {
  DocNoOrg,
  DocQueryResult,
  OffsetAndLimit,
  OrgMemberNoOrg,
  OrgMemberNoUser,
  OrgMemberNoUserOrg,
  OrgMemberRelation,
  OrgTeamsMembers,
  QnaNoOrg,
  QnaQueryResult,
  TeamMemberUserOrgMember,
  TeamNoOrg,
  UserRelation,
} from '@newbee/shared/util';
import {
  OrgRoleEnum,
  TeamRoleEnum,
  cannotDeleteMaintainerBadReqest,
  cannotDeleteOnlyOrgOwnerBadRequest,
  cannotDeleteOnlyTeamOwnerBadRequest,
  internalServerError,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import {
  AuthenticatorEntity,
  DocEntity,
  OrgMemberEntity,
  OrgMemberInviteEntity,
  OrganizationEntity,
  PostEntity,
  QnaEntity,
  TeamEntity,
  TeamMemberEntity,
  UserEntity,
  UserInvitesEntity,
} from '../entity';

/**
 * A helper service for anything to do with entities.
 * Logic should be put here when it's needed across several modules, which might otherwise cause circular dependencies.
 */
@Injectable()
export class EntityService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(EntityService.name);

  constructor(private readonly em: EntityManager) {}

  // START: Entities to query results

  /**
   * Takes in an array of `DocEntity` and converts it into an array of `DocQueryResult`.
   *
   * @param docs The docs to convert.
   *
   * @returns The entities as `DocQueryResult`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createDocQueryResults(docs: DocEntity[]): Promise<DocQueryResult[]> {
    await this.populatePostMembersTeam(docs);
    return docs.map((doc) => {
      const {
        createdAt,
        updatedAt,
        markedUpToDateAt,
        title,
        slug,
        upToDateDuration,
        outOfDateAt,
        team,
        creator,
        maintainer,
        docTxt,
      } = doc;
      return {
        doc: {
          createdAt,
          updatedAt,
          markedUpToDateAt,
          title,
          slug,
          upToDateDuration,
          outOfDateAt,
          docSnippet: docTxt.slice(0, 100),
        },
        creator: creator && {
          orgMember: creator,
          user: creator.user,
        },
        maintainer: maintainer && {
          orgMember: maintainer,
          user: maintainer.user,
        },
        team,
      };
    });
  }

  /**
   * Takes in an array of `QnaEntity` and converts it into an array of `QnaQueryResult`.
   *
   * @param qnas The qnas to convert.
   *
   * @returns The entities as `QnaQueryResult`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createQnaQueryResults(qnas: QnaEntity[]): Promise<QnaQueryResult[]> {
    await this.populatePostMembersTeam(qnas);
    return qnas.map((qna) => {
      const {
        createdAt,
        updatedAt,
        markedUpToDateAt,
        title,
        slug,
        upToDateDuration,
        outOfDateAt,
        team,
        creator,
        maintainer,
        questionTxt,
        answerTxt,
      } = qna;
      return {
        qna: {
          createdAt,
          updatedAt,
          markedUpToDateAt,
          title,
          slug,
          upToDateDuration,
          outOfDateAt,
          questionSnippet: questionTxt?.slice(0, 100) ?? null,
          answerSnippet: answerTxt?.slice(0, 100) ?? null,
        },
        creator: creator && {
          orgMember: creator,
          user: creator.user,
        },
        maintainer: maintainer && {
          orgMember: maintainer,
          user: maintainer.user,
        },
        team,
      };
    });
  }

  // END: Entities to query results

  // START: Entity relations

  /**
   * Takes in an organization and converts it to an `OrgTeams`.
   *
   * @param organization The org to convert.
   *
   * @returns The org as an `OrgTeams`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createOrgTeamsMembers(
    organization: OrganizationEntity,
  ): Promise<OrgTeamsMembers> {
    try {
      await this.em.populate(organization, ['teams', 'members.user']);
      return {
        organization,
        teams: organization.teams.toArray(),
        members: organization.members
          .getItems()
          .map((orgMember) => ({ orgMember, user: orgMember.user })),
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Takes in an org member and converts it to an `OrgMemberNoOrg`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as an `OrgMemberNoOrg`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createOrgMemberNoOrg(
    orgMember: OrgMemberEntity,
  ): Promise<OrgMemberNoOrg> {
    const orgMemberCollections =
      await this.populateOrgMemberCollections(orgMember);

    try {
      await this.em.populate(orgMember, ['user']);
      const { user } = orgMember;

      return { orgMember, user, ...orgMemberCollections };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Takes in an org member and converts it to an `OrgMemberNoUser`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as an `OrgMemberNoUser`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createOrgMemberNoUser(
    orgMember: OrgMemberEntity,
  ): Promise<OrgMemberNoUser> {
    const orgMemberCollections =
      await this.populateOrgMemberCollections(orgMember);

    try {
      await this.em.populate(orgMember, ['organization']);
      const { organization } = orgMember;

      return { orgMember, organization, ...orgMemberCollections };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Takes in an org member and converts it to an `OrgMemberNoUserOrg`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as an `OrgMemberNoUserOrg`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createOrgMemberNoUserOrg(
    orgMember: OrgMemberEntity,
  ): Promise<OrgMemberNoUserOrg> {
    const orgMemberCollections =
      await this.populateOrgMemberCollections(orgMember);
    return { orgMember, ...orgMemberCollections };
  }

  /**
   * Takes in a `TeamEntity` and converts it into a `TeamNoOrg`.
   *
   * @param team The `TeamEntity` to convert.
   *
   * @returns The entity as a `TeamNoOrg`.
   */
  async createTeamNoOrg(team: TeamEntity): Promise<TeamNoOrg> {
    try {
      await this.em.populate(team, ['teamMembers.orgMember.user']);

      const postOffsetAndLimit: OffsetAndLimit = {
        offset: 0,
        limit: 3,
      };
      const postFindAndCountOptions = {
        ...postOffsetAndLimit,
        orderBy: { markedUpToDateAt: QueryOrder.DESC },
      };
      const [docs, docsCount] = await this.em.findAndCount(
        DocEntity,
        { team },
        postFindAndCountOptions,
      );
      const [qnas, qnasCount] = await this.em.findAndCount(
        QnaEntity,
        { team },
        postFindAndCountOptions,
      );

      return {
        team,
        docs: {
          results: await this.createDocQueryResults(docs),
          total: docsCount,
          ...postOffsetAndLimit,
        },
        qnas: {
          results: await this.createQnaQueryResults(qnas),
          total: qnasCount,
          ...postOffsetAndLimit,
        },
        teamMembers: team.teamMembers.getItems().map((teamMember) => ({
          teamMember,
          orgMember: teamMember.orgMember,
          user: teamMember.orgMember.user,
        })),
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Takes in a `TeamMemberEntity` and converts it to a `TeamMemberUserOrgMember`.
   *
   * @param teamMember The team member to convert.
   *
   * @returns The entity as a `TeamMemberUserOrgMember`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createTeamMemberUserOrgMember(
    teamMember: TeamMemberEntity,
  ): Promise<TeamMemberUserOrgMember> {
    try {
      await this.em.populate(teamMember, ['orgMember.user']);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    return {
      teamMember,
      orgMember: teamMember.orgMember,
      user: teamMember.orgMember.user,
    };
  }

  /**
   * Takes in a `DocEntity` and converts it to a `DocNoOrg`.
   *
   * @param doc The doc to convert.
   *
   * @returns The entities as `DocNoOrg`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createDocNoOrg(doc: DocEntity): Promise<DocNoOrg> {
    await this.populatePostMembersTeam(doc);
    return {
      doc,
      creator: doc.creator && {
        orgMember: doc.creator,
        user: doc.creator.user,
      },
      maintainer: doc.maintainer && {
        orgMember: doc.maintainer,
        user: doc.maintainer.user,
      },
      team: doc.team,
    };
  }

  /**
   * Takes in a `QnaEntity` and converts it to a `QnaNoOrg`.
   *
   * @param qna The qna to convert.
   *
   * @returns The entities as `QnaNoOrg`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createQnaNoOrg(qna: QnaEntity): Promise<QnaNoOrg> {
    await this.populatePostMembersTeam(qna);
    return {
      qna,
      creator: qna.creator && {
        orgMember: qna.creator,
        user: qna.creator.user,
      },
      maintainer: qna.maintainer && {
        orgMember: qna.maintainer,
        user: qna.maintainer.user,
      },
      team: qna.team,
    };
  }

  /**
   * Takes in a user and converts it to a `UserEntity`.
   *
   * @param user The user to convert.
   *
   * @returns The user as a `UserRelation`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createUserRelation(user: UserEntity): Promise<UserRelation> {
    try {
      await this.em.populate(user, [
        'organizations.organization',
        'invites.orgMemberInvites.organization',
      ]);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const { invites, organizations } = user;
    return {
      user,
      organizations: organizations
        .getItems()
        .map((orgMember) => orgMember.organization),
      invites: invites.orgMemberInvites.getItems().map((orgMemberInvite) => {
        const { organization } = orgMemberInvite;
        return { orgMemberInvite, organization };
      }),
    };
  }

  /**
   * A helper function to populate the relations related to a post's members and team.
   *
   * @param posts The posts to populate.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  private async populatePostMembersTeam(
    posts: PostEntity | PostEntity[],
  ): Promise<void> {
    try {
      await this.em.populate(posts, [
        'creator.user',
        'maintainer.user',
        'team',
      ]);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * A helper function to populate all of the collections of an org member.
   *
   * @param orgMember The org member to populate.
   *
   * @returns The popualted collections of the org member.
   */
  private async populateOrgMemberCollections(
    orgMember: OrgMemberEntity,
  ): Promise<
    Pick<
      OrgMemberRelation,
      | 'teams'
      | 'createdDocs'
      | 'maintainedDocs'
      | 'createdQnas'
      | 'maintainedQnas'
    >
  > {
    try {
      const teamMembers = await this.em.find(
        TeamMemberEntity,
        { orgMember },
        { populate: ['team'] },
      );

      const postOffsetAndLimit: OffsetAndLimit = {
        offset: 0,
        limit: 3,
      };
      const postFindAndCountOptions = {
        ...postOffsetAndLimit,
        orderBy: { markedUpToDateAt: QueryOrder.DESC },
      };
      const [createdDocs, createdDocsCount] = await this.em.findAndCount(
        DocEntity,
        { creator: orgMember },
        postFindAndCountOptions,
      );
      const [maintainedDocs, maintainedDocsCount] = await this.em.findAndCount(
        DocEntity,
        { maintainer: orgMember },
        postFindAndCountOptions,
      );
      const [createdQnas, createdQnasCount] = await this.em.findAndCount(
        QnaEntity,
        { creator: orgMember },
        postFindAndCountOptions,
      );
      const [maintainedQnas, maintainedQnasCount] = await this.em.findAndCount(
        QnaEntity,
        { maintainer: orgMember },
        postFindAndCountOptions,
      );

      return {
        teams: teamMembers.map((teamMember) => ({
          teamMember,
          team: teamMember.team,
        })),
        createdDocs: {
          results: await this.createDocQueryResults(createdDocs),
          total: createdDocsCount,
          ...postOffsetAndLimit,
        },
        maintainedDocs: {
          results: await this.createDocQueryResults(maintainedDocs),
          total: maintainedDocsCount,
          ...postOffsetAndLimit,
        },
        createdQnas: {
          results: await this.createQnaQueryResults(createdQnas),
          total: createdQnasCount,
          ...postOffsetAndLimit,
        },
        maintainedQnas: {
          results: await this.createQnaQueryResults(maintainedQnas),
          total: maintainedQnasCount,
          ...postOffsetAndLimit,
        },
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  // END: Entity relations

  // START: Misc

  /**
   * Check whether the given entity is safe to delete and throw a `BadRequestException` if it's not.
   *
   * @param entity The entity to check.
   *
   * @throws {BadRequestException} `cannotDeleteMaintainerBadRequest`, `cannotDeleteOnlyTeamOwnerBadRequest`, `cannotDeleteOnlyOrgOwnerBadRequest`. If trying to delete a user who's the only maintainer of a post, the only team owner, or the only org owner.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async safeToDelete(
    entity:
      | AuthenticatorEntity
      | DocEntity
      | OrgMemberInviteEntity
      | OrgMemberEntity
      | OrganizationEntity
      | QnaEntity
      | TeamMemberEntity
      | TeamEntity
      | UserInvitesEntity
      | UserEntity,
  ): Promise<void> {
    try {
      await this.em.populate(entity, true);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    if (
      entity instanceof AuthenticatorEntity ||
      entity instanceof DocEntity ||
      entity instanceof OrgMemberInviteEntity ||
      entity instanceof OrganizationEntity ||
      entity instanceof QnaEntity ||
      entity instanceof TeamEntity ||
      entity instanceof UserInvitesEntity
    ) {
      return;
    } else if (entity instanceof OrgMemberEntity) {
      if (entity.maintainedDocs.length || entity.maintainedQnas.length) {
        throw new BadRequestException(cannotDeleteMaintainerBadReqest);
      }

      for (const teamMember of entity.teams) {
        await this.safeToDelete(teamMember);
      }

      if (entity.role !== OrgRoleEnum.Owner) {
        return;
      }

      const owners = await this.em.find(OrgMemberEntity, {
        role: OrgRoleEnum.Owner,
        organization: entity.organization,
      });
      if (owners.length === 1) {
        throw new BadRequestException(cannotDeleteOnlyOrgOwnerBadRequest);
      }
    } else if (entity instanceof TeamMemberEntity) {
      if (entity.role !== TeamRoleEnum.Owner) {
        return;
      }

      const owners = await this.em.find(TeamMemberEntity, {
        role: TeamRoleEnum.Owner,
        team: entity.team,
      });
      if (owners.length === 1) {
        throw new BadRequestException(cannotDeleteOnlyTeamOwnerBadRequest);
      }
    } /* UserEntity */ else {
      for (const orgMember of entity.organizations) {
        await this.safeToDelete(orgMember);
      }
    }
  }

  /**
   * A helper function for finding the true up-to-date duration value for a post, which may optionally have new values for its up-to-date duration or team.
   *
   * The method makes the assumption that the post's team and organization have been populated. If working with the doc or qna endpoints, this should be done by the `RoleGuard`.
   *
   * @param post The post to examine.
   * @param upToDateDuration The new value for up-to-date duration, if any. It should be `undefined` if there is no new value.
   * @param team The new value for team, if any. It should be `undefined` if there is no new value.
   *
   * @returns The up-to-date duration that the post is actually using.
   */
  static trueUpToDateDuration(
    post: PostEntity,
    upToDateDuration: string | null | undefined,
    team: TeamEntity | null | undefined,
  ): Duration {
    if (upToDateDuration || upToDateDuration === null) {
      if (team || team === null) {
        return dayjs.duration(
          upToDateDuration ??
            team?.upToDateDuration ??
            post.organization.upToDateDuration,
        );
      }

      // team === undefined
      return dayjs.duration(
        upToDateDuration ??
          post.team?.upToDateDuration ??
          post.organization.upToDateDuration,
      );
    }

    // upToDateDuration === undefined
    if (team || team === null) {
      return dayjs.duration(
        post.upToDateDuration ??
          team?.upToDateDuration ??
          post.organization.upToDateDuration,
      );
    }

    // upToDateDuration === undefined && team === undefined
    return dayjs.duration(
      post.upToDateDuration ??
        post.team?.upToDateDuration ??
        post.organization.upToDateDuration,
    );
  }

  /**
   * Finds all of the `DocEntity` associated with the given org and possibly team.
   *
   * @param offsetAndLimit The offset and limit to look for.
   * @param organization The organization whose docs to look for.
   * @param team The team whose docs to look for within the org, if applicable.
   *
   * @returns A tuple containing the found doc entities and a count of the total number of docs in the org.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async findDocsByOrgAndCount(
    offsetAndLimit: OffsetAndLimit,
    organization: OrganizationEntity,
    team?: TeamEntity,
  ): Promise<[DocEntity[], number]> {
    const { offset, limit } = offsetAndLimit;
    try {
      return await this.em.findAndCount(
        DocEntity,
        { organization, ...(team && { team }) },
        { orderBy: { markedUpToDateAt: QueryOrder.DESC }, offset, limit },
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds all of the `QnaEntity` associated with the given org and possibly team.
   *
   * @param offsetAndLimit The offset and limit to look for.
   * @param organization The organization whose qnas to look for.
   * @param team The team whose qnas to look for within the org, if applicable.
   *
   * @returns A tuple containing the found qna entities and a count of the total number of qnas in the org.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async findQnasByOrgAndCount(
    offsetAndLimit: OffsetAndLimit,
    organization: OrganizationEntity,
    team?: TeamEntity,
  ): Promise<[QnaEntity[], number]> {
    const { offset, limit } = offsetAndLimit;
    try {
      return await this.em.findAndCount(
        QnaEntity,
        { organization, ...(team && { team }) },
        { orderBy: { markedUpToDateAt: QueryOrder.DESC }, offset, limit },
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  // END: Misc
}
