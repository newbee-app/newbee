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
  OrgMemberNoUser,
  OrgMemberRelation,
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
   * Takes in an org member and converts it to an `OrgMemberRelation`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as an `OrgMemberRelation`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createOrgMemberRelation(
    orgMember: OrgMemberEntity
  ): Promise<OrgMemberRelation> {
    const orgMemberNoUser = await this.createOrgMemberNoUser(orgMember);

    try {
      await this.em.populate(orgMember, ['user']);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const { user } = orgMember;

    return {
      ...orgMemberNoUser,
      user,
    };
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
    try {
      await this.em.populate(orgMember, [
        'organization',
        'teams.team',
        'createdDocs',
        'maintainedDocs',
        'createdQnas',
        'maintainedQnas',
      ]);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const {
      organization,
      teams,
      createdDocs,
      maintainedDocs,
      createdQnas,
      maintainedQnas,
    } = orgMember;

    return {
      orgMember,
      organization,
      teams: teams.getItems().map((teamMember) => {
        const { team } = teamMember;
        return { teamMember, team };
      }),
      createdDocs: createdDocs.getItems(),
      maintainedDocs: maintainedDocs.getItems(),
      createdQnas: createdQnas.getItems(),
      maintainedQnas: maintainedQnas.getItems(),
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
      | UserChallengeEntity
      | UserInvitesEntity
      | UserSettingsEntity
      | UserEntity
  ): Promise<void> {
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
    }

    if (entity instanceof OrgMemberEntity) {
      try {
        await this.em.populate(entity, [
          'maintainedDocs',
          'maintainedQnas',
          'teams',
        ]);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerError);
      }

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
      try {
        await this.em.populate(entity, ['organizations']);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerError);
      }

      for (const orgMember of entity.organizations) {
        await this.safeToDelete(orgMember);
      }
    }
  }

  /**
   * Prepare to delete the given entity by first deleting relations that need to be explicitly deleted.
   * Throws a BadRequestException if it's unsafe to delete the entity or one of its relations.
   *
   * @param entity The entity to prepare to delete.
   *
   * @throws {BadRequestException} `cannotDeleteMaintainerBadRequest`, `cannotDeleteOnlyTeamOwnerBadRequest`, `cannotDeleteOnlyOrgOwnerBadRequest`. If trying to delete a user who's the only maintainer of a post, the only team owner, or the only org owner.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async prepareToDelete(
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
    await this.safeToDelete(entity);

    if (
      entity instanceof AuthenticatorEntity ||
      entity instanceof DocEntity ||
      entity instanceof OrgMemberInviteEntity ||
      entity instanceof QnaEntity ||
      entity instanceof TeamMemberEntity ||
      entity instanceof UserChallengeEntity ||
      entity instanceof UserSettingsEntity
    ) {
      return;
    }

    if (entity instanceof OrgMemberEntity) {
      try {
        await this.em.populate(entity, [
          'teams',
          'createdDocs',
          'maintainedDocs',
          'createdQnas',
          'maintainedQnas',
        ]);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerError);
      }

      const {
        teams,
        createdDocs,
        maintainedDocs,
        createdQnas,
        maintainedQnas,
      } = entity;
      for (const collection of [
        teams,
        createdDocs,
        maintainedDocs,
        createdQnas,
        maintainedQnas,
      ]) {
        for (const item of collection.getItems()) {
          await this.prepareToDelete(item);
        }

        collection.removeAll();
      }
    } else if (entity instanceof OrganizationEntity) {
      try {
        await this.em.populate(entity, [
          'teams',
          'docs',
          'qnas',
          'members',
          'invites',
        ]);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerError);
      }

      const { teams, docs, qnas, members, invites } = entity;
      for (const collection of [teams, docs, qnas, members, invites]) {
        for (const item of collection.getItems()) {
          await this.prepareToDelete(item);
        }

        collection.removeAll();
      }
    } else if (entity instanceof TeamEntity) {
      try {
        await this.em.populate(entity, ['docs', 'qnas', 'teamMembers']);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerError);
      }

      const { docs, qnas, teamMembers } = entity;
      for (const collection of [docs, qnas, teamMembers]) {
        for (const item of collection.getItems()) {
          await this.prepareToDelete(item);
        }

        collection.removeAll();
      }
    } else if (entity instanceof UserInvitesEntity) {
      try {
        await this.em.populate(entity, ['orgMemberInvites']);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerError);
      }

      const { orgMemberInvites } = entity;
      for (const item of orgMemberInvites.getItems()) {
        await this.prepareToDelete(item);
      }

      orgMemberInvites.removeAll();
    } /* UserEntity */ else {
      try {
        await this.em.populate(entity, [
          'invites',
          'authenticators',
          'organizations',
        ]);
      } catch (err) {
        this.logger.error(err);
        throw new InternalServerErrorException(internalServerError);
      }

      const { invites, authenticators, organizations } = entity;
      await this.prepareToDelete(invites);

      for (const collection of [authenticators, organizations]) {
        for (const item of collection.getItems()) {
          await this.prepareToDelete(item);
        }

        collection.removeAll();
      }
    }
  }
}
