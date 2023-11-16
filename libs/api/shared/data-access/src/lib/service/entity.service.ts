import { QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  DocDocParams,
  OrgMemberDocParams,
  QnaDocParams,
  TeamDocParams,
} from '@newbee/api/shared/util';
import type {
  DocNoOrg,
  DocQueryResult,
  OrgMemberNoOrg,
  OrgMemberNoUser,
  OrgMemberNoUserOrg,
  OrgMemberRelation,
  OrgTeams,
  QnaNoOrg,
  QnaQueryResult,
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

  /**
   * Creates the fields to add or replace a NewBee doc in a Solr index.
   *
   * @param doc The doc to translate.
   *
   * @returns The params to add or replace a Solr doc using SolrCli.
   */
  createDocDocParams(doc: DocEntity): DocDocParams {
    const {
      id,
      slug,
      team,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      outOfDateAt,
      title,
      creator,
      maintainer,
      docTxt,
    } = doc;
    return new DocDocParams(
      id,
      slug,
      team?.id ?? null,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      outOfDateAt,
      title,
      creator?.id ?? null,
      maintainer?.id ?? null,
      docTxt,
    );
  }

  /**
   * Creates the fields to add or replace a qna doc in a Solr index.
   *
   * @param qna The qna entity to translate.
   *
   * @returns The params to add or replace a qna doc using SolrCli.
   */
  createQnaDocParams(qna: QnaEntity): QnaDocParams {
    const {
      id,
      slug,
      team,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      outOfDateAt,
      title,
      creator,
      maintainer,
      questionTxt,
      answerTxt,
    } = qna;
    return new QnaDocParams(
      id,
      slug,
      team?.id ?? null,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      outOfDateAt,
      title,
      creator?.id ?? null,
      maintainer?.id ?? null,
      questionTxt,
      answerTxt,
    );
  }

  /**
   * Creates the fields to add or replace a team doc in a Solr index.
   *
   * @param team The team entity to translate.
   *
   * @returns The params to add or replace a team doc using SolrCli.
   */
  createTeamDocParams(team: TeamEntity): TeamDocParams {
    const { id, slug, name } = team;
    return new TeamDocParams(id, slug, name);
  }

  /**
   * Create the fields to add or replace an org member doc in a Solr index.
   *
   * @param orgMember The org member entity to translate.
   *
   * @returns The params to add or replace an org member doc using SolrCli.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createOrgMemberDocParams(
    orgMember: OrgMemberEntity,
  ): Promise<OrgMemberDocParams> {
    try {
      await this.em.populate(orgMember, ['user']);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const { id, slug, role, user } = orgMember;
    const { email, name, displayName, phoneNumber } = user;
    return new OrgMemberDocParams(
      id,
      slug,
      email,
      name,
      displayName,
      phoneNumber,
      role,
    );
  }

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

  async createOrgTeams(organization: OrganizationEntity): Promise<OrgTeams> {
    try {
      await this.em.populate(organization, ['teams']);
      return { organization, teams: organization.teams.toArray() };
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
      const postFindAndCountOptions = {
        orderBy: { markedUpToDateAt: QueryOrder.DESC },
        limit: 3,
        offset: 0,
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
      const [teamMembers, teamMembersCount] = await this.em.findAndCount(
        TeamMemberEntity,
        { team },
        {
          orderBy: { role: QueryOrder.DESC },
          limit: 5,
          offset: 0,
          populate: ['orgMember.user'],
        },
      );

      return {
        team,
        docs: {
          sample: await this.createDocQueryResults(docs),
          total: docsCount,
        },
        qnas: {
          sample: await this.createQnaQueryResults(qnas),
          total: qnasCount,
        },
        teamMembers: {
          sample: teamMembers.map((teamMember) => ({
            teamMember,
            orgMember: teamMember.orgMember,
            user: teamMember.orgMember.user,
          })),
          total: teamMembersCount,
        },
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
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
      const [teams, teamsCount] = await this.em.findAndCount(
        TeamMemberEntity,
        { orgMember },
        { limit: 5, offset: 0, populate: ['team'] },
      );

      const postFindAndCountOptions = {
        orderBy: { markedUpToDateAt: QueryOrder.DESC },
        limit: 3,
        offset: 0,
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
        teams: {
          sample: teams.map((team) => ({ teamMember: team, team: team.team })),
          total: teamsCount,
        },
        createdDocs: {
          sample: await this.createDocQueryResults(createdDocs),
          total: createdDocsCount,
        },
        maintainedDocs: {
          sample: await this.createDocQueryResults(maintainedDocs),
          total: maintainedDocsCount,
        },
        createdQnas: {
          sample: await this.createQnaQueryResults(createdQnas),
          total: createdQnasCount,
        },
        maintainedQnas: {
          sample: await this.createQnaQueryResults(maintainedQnas),
          total: maintainedQnasCount,
        },
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
