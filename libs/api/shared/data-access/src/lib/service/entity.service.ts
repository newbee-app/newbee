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
  OrgMemberNoOrg,
  OrgMemberNoUser,
  OrgMemberRelation,
  TeamNoOrg,
  UserRelation,
} from '@newbee/shared/util';
import {
  cannotDeleteMaintainerBadReqest,
  cannotDeleteOnlyOrgOwnerBadRequest,
  cannotDeleteOnlyTeamOwnerBadRequest,
  internalServerError,
  OrgRoleEnum,
  TeamRoleEnum,
} from '@newbee/shared/util';
import {
  AuthenticatorEntity,
  DocEntity,
  OrganizationEntity,
  OrgMemberEntity,
  OrgMemberInviteEntity,
  QnaEntity,
  TeamEntity,
  TeamMemberEntity,
  UserChallengeEntity,
  UserEntity,
  UserInvitesEntity,
  UserSettingsEntity,
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
      upToDate,
      creator,
      maintainer,
      title,
      docTxt,
    } = doc;
    return new DocDocParams(
      id,
      slug,
      team?.id ?? null,
      createdAt,
      updatedAt,
      markedUpToDateAt,
      upToDate,
      creator?.id ?? null,
      maintainer?.id ?? null,
      title,
      docTxt
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
      upToDate,
      creator,
      maintainer,
      title,
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
      upToDate,
      creator?.id ?? null,
      maintainer?.id ?? null,
      title,
      questionTxt,
      answerTxt
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
   */
  async createOrgMemberDocParams(
    orgMember: OrgMemberEntity
  ): Promise<OrgMemberDocParams> {
    try {
      await this.em.populate(orgMember, ['user']);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const { id, slug, user } = orgMember;
    const { name, displayName } = user;
    return new OrgMemberDocParams(id, slug, name, displayName);
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
    orgMember: OrgMemberEntity
  ): Promise<OrgMemberNoOrg> {
    const orgMemberCollections = await this.populateOrgMemberCollections(
      orgMember
    );

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
    orgMember: OrgMemberEntity
  ): Promise<OrgMemberNoUser> {
    const orgMemberCollections = await this.populateOrgMemberCollections(
      orgMember
    );

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
   * A helper function to populate all of the collections of an org member.
   *
   * @param orgMember The org member to populate.
   *
   * @returns The popualted collections of the org member.
   */
  private async populateOrgMemberCollections(
    orgMember: OrgMemberEntity
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
        { limit: 5, offset: 0, populate: ['team'] }
      );

      const postFindAndCountOptions = {
        orderBy: { markedUpToDateAt: QueryOrder.DESC },
        limit: 3,
        offset: 0,
      };
      const [createdDocs, createdDocsCount] = await this.em.findAndCount(
        DocEntity,
        { creator: orgMember },
        postFindAndCountOptions
      );
      const [maintainedDocs, maintainedDocsCount] = await this.em.findAndCount(
        DocEntity,
        { maintainer: orgMember },
        postFindAndCountOptions
      );
      const [createdQnas, createdQnasCount] = await this.em.findAndCount(
        QnaEntity,
        { creator: orgMember },
        postFindAndCountOptions
      );
      const [maintainedQnas, maintainedQnasCount] = await this.em.findAndCount(
        QnaEntity,
        { maintainer: orgMember },
        postFindAndCountOptions
      );

      return {
        teams: {
          sample: teams.map((team) => ({ teamMember: team, team: team.team })),
          total: teamsCount,
        },
        createdDocs: { sample: createdDocs, total: createdDocsCount },
        maintainedDocs: { sample: maintainedDocs, total: maintainedDocsCount },
        createdQnas: { sample: createdQnas, total: createdQnasCount },
        maintainedQnas: { sample: maintainedQnas, total: maintainedQnasCount },
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
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
        {
          ...postFindAndCountOptions,
          populate: ['creator.user', 'maintainer.user'],
        }
      );
      const [qnas, qnasCount] = await this.em.findAndCount(
        QnaEntity,
        { team },
        {
          ...postFindAndCountOptions,
          populate: ['creator.user', 'maintainer.user'],
        }
      );
      const [teamMembers, teamMembersCount] = await this.em.findAndCount(
        TeamMemberEntity,
        { team },
        {
          orderBy: { role: QueryOrder.DESC },
          limit: 5,
          offset: 0,
          populate: ['orgMember.user'],
        }
      );

      return {
        team,
        docs: {
          sample: docs.map((doc) => ({
            doc,
            creator: doc.creator && {
              orgMember: doc.creator,
              user: doc.creator.user,
            },
            maintainer: doc.maintainer && {
              orgMember: doc.maintainer,
              user: doc.maintainer.user,
            },
          })),
          total: docsCount,
        },
        qnas: {
          sample: qnas.map((qna) => ({
            qna,
            creator: qna.creator && {
              orgMember: qna.creator,
              user: qna.creator.user,
            },
            maintainer: qna.maintainer && {
              orgMember: qna.maintainer,
              user: qna.maintainer.user,
            },
          })),
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
      | UserChallengeEntity
      | UserInvitesEntity
      | UserSettingsEntity
      | UserEntity
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
      entity instanceof UserChallengeEntity ||
      entity instanceof UserInvitesEntity ||
      entity instanceof UserSettingsEntity
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
}
