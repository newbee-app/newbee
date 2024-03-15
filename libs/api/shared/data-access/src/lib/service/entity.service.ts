import { QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { adminControlsId } from '@newbee/api/shared/util';
import { Permissions } from '@newbee/oriz';
import type {
  AdminControlsRelation,
  DocNoOrg,
  DocSearchResult,
  OffsetAndLimit,
  OrgMemberNoOrg,
  OrgMemberNoUser,
  OrgMemberNoUserOrg,
  OrgMemberRelation,
  OrgTeamsMembers,
  PublicAdminControls,
  PublicUser,
  QnaNoOrg,
  QnaSearchResult,
  TeamMemberUserOrgMember,
  TeamNoOrg,
  UserRelation,
} from '@newbee/shared/util';
import {
  OrgRoleEnum,
  TeamRoleEnum,
  UserRoleEnum,
  cannotDeleteMaintainerBadReqest,
  cannotDeleteOnlyOrgOwnerBadRequest,
  cannotDeleteOnlyTeamOwnerBadRequest,
  compareOrgRoles,
  compareTeamRoles,
  defaultLimit,
} from '@newbee/shared/util';
import { ClassConstructor } from 'class-transformer';
import dayjs from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import {
  AdminControlsEntity,
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
  WaitlistMemberEntity,
} from '../entity';
import { OrizAction, OrizSubject } from '../type';

/**
 * A helper service for anything to do with entities.
 * All functions in the service should be static.
 *
 * Put functions in here when:
 * - It's needed across several modules, which might otherwise cause circular dependencies.
 * - You want to make it a function of an entity class (entity classes should be kept clean of everything but its properties and constructor).
 */
@Injectable()
export class EntityService {
  constructor(private readonly em: EntityManager) {}

  // START: Entities to search results

  /**
   * Takes in an array of `DocEntity` and converts it into an array of `DocSearchResult`.
   *
   * @param docs The docs to convert.
   *
   * @returns The entities as `DocSearchResult`.
   */
  async createDocSearchResults(docs: DocEntity[]): Promise<DocSearchResult[]> {
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
   * Takes in an array of `QnaEntity` and converts it into an array of `QnaSearchResult`.
   *
   * @param qnas The qnas to convert.
   *
   * @returns The entities as `QnaSearchResult`.
   */
  async createQnaSearchResults(qnas: QnaEntity[]): Promise<QnaSearchResult[]> {
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

  // END: Entities to search results

  // START: Entity relations

  /**
   * Takes in an organization and converts it to an `OrgTeams`.
   *
   * @param organization The org to convert.
   *
   * @returns The org as an `OrgTeams`.
   */
  async createOrgTeamsMembers(
    organization: OrganizationEntity,
  ): Promise<OrgTeamsMembers> {
    await this.em.populate(organization, ['teams', 'members.user']);
    return {
      organization,
      teams: organization.teams.toArray(),
      members: organization.members.getItems().map((orgMember) => ({
        orgMember,
        user: EntityService.createPublicUser(orgMember.user),
      })),
    };
  }

  /**
   * Takes in an org member and converts it to an `OrgMemberNoOrg`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as an `OrgMemberNoOrg`.
   */
  async createOrgMemberNoOrg(
    orgMember: OrgMemberEntity,
  ): Promise<OrgMemberNoOrg> {
    const orgMemberCollections =
      await this.populateOrgMemberCollections(orgMember);
    await this.em.populate(orgMember, ['user']);
    const { user } = orgMember;
    return {
      orgMember,
      user: EntityService.createPublicUser(user),
      ...orgMemberCollections,
    };
  }

  /**
   * Takes in an org member and converts it to an `OrgMemberNoUser`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as an `OrgMemberNoUser`.
   */
  async createOrgMemberNoUser(
    orgMember: OrgMemberEntity,
  ): Promise<OrgMemberNoUser> {
    const orgMemberCollections =
      await this.populateOrgMemberCollections(orgMember);
    await this.em.populate(orgMember, ['organization']);
    const { organization } = orgMember;
    return { orgMember, organization, ...orgMemberCollections };
  }

  /**
   * Takes in an org member and converts it to an `OrgMemberNoUserOrg`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as an `OrgMemberNoUserOrg`.
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
        results: await this.createDocSearchResults(docs),
        total: docsCount,
        ...postOffsetAndLimit,
      },
      qnas: {
        results: await this.createQnaSearchResults(qnas),
        total: qnasCount,
        ...postOffsetAndLimit,
      },
      teamMembers: team.teamMembers.getItems().map((teamMember) => ({
        teamMember,
        orgMember: teamMember.orgMember,
        user: EntityService.createPublicUser(teamMember.orgMember.user),
      })),
    };
  }

  /**
   * Takes in a `TeamMemberEntity` and converts it to a `TeamMemberUserOrgMember`.
   *
   * @param teamMember The team member to convert.
   *
   * @returns The entity as a `TeamMemberUserOrgMember`.
   */
  async createTeamMemberUserOrgMember(
    teamMember: TeamMemberEntity,
  ): Promise<TeamMemberUserOrgMember> {
    await this.em.populate(teamMember, ['orgMember.user']);
    return {
      teamMember,
      orgMember: teamMember.orgMember,
      user: EntityService.createPublicUser(teamMember.orgMember.user),
    };
  }

  /**
   * Takes in a `DocEntity` and converts it to a `DocNoOrg`.
   *
   * @param doc The doc to convert.
   *
   * @returns The entities as `DocNoOrg`.
   */
  async createDocNoOrg(doc: DocEntity): Promise<DocNoOrg> {
    await this.populatePostMembersTeam(doc);
    return {
      doc,
      creator: doc.creator && {
        orgMember: doc.creator,
        user: EntityService.createPublicUser(doc.creator.user),
      },
      maintainer: doc.maintainer && {
        orgMember: doc.maintainer,
        user: EntityService.createPublicUser(doc.maintainer.user),
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
   */
  async createQnaNoOrg(qna: QnaEntity): Promise<QnaNoOrg> {
    await this.populatePostMembersTeam(qna);
    return {
      qna,
      creator: qna.creator && {
        orgMember: qna.creator,
        user: EntityService.createPublicUser(qna.creator.user),
      },
      maintainer: qna.maintainer && {
        orgMember: qna.maintainer,
        user: EntityService.createPublicUser(qna.maintainer.user),
      },
      team: qna.team,
    };
  }

  /**
   * Takes in a user and converts it to a `UserRelation`.
   *
   * @param user The user to convert.
   *
   * @returns The user as a `UserRelation`.
   */
  async createUserRelation(user: UserEntity): Promise<UserRelation> {
    await this.em.populate(user, [
      'organizations.organization',
      'invites.orgMemberInvites.organization',
    ]);
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
   */
  private async populatePostMembersTeam(
    posts: PostEntity | PostEntity[],
  ): Promise<void> {
    await this.em.populate(posts, ['creator.user', 'maintainer.user', 'team']);
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
        results: await this.createDocSearchResults(createdDocs),
        total: createdDocsCount,
        ...postOffsetAndLimit,
      },
      maintainedDocs: {
        results: await this.createDocSearchResults(maintainedDocs),
        total: maintainedDocsCount,
        ...postOffsetAndLimit,
      },
      createdQnas: {
        results: await this.createQnaSearchResults(createdQnas),
        total: createdQnasCount,
        ...postOffsetAndLimit,
      },
      maintainedQnas: {
        results: await this.createQnaSearchResults(maintainedQnas),
        total: maintainedQnasCount,
        ...postOffsetAndLimit,
      },
    };
  }

  // END: Entity relations

  // START: Misc

  /**
   * Get the NewBee instance's admin controls.
   *
   * @returns The NewBee instance's admin controls.
   */
  async getAdminControls(): Promise<AdminControlsEntity> {
    let adminControls = await this.em.findOne(
      AdminControlsEntity,
      adminControlsId,
    );
    if (adminControls) {
      return adminControls;
    }

    adminControls = new AdminControlsEntity();
    await this.em.persistAndFlush(adminControls);
    return adminControls;
  }

  /**
   * Get the NewBee instance's public admin controls.
   *
   * @returns The NewBee instance's public admin controls.
   */
  async getPublicAdminControls(): Promise<PublicAdminControls> {
    const adminControls = await this.getAdminControls();
    const { allowRegistration, allowWaitlist } = adminControls;
    return { allowRegistration, allowWaitlist };
  }

  /**
   * Gets the NewBee instance's admin controls as an `AdminControlsRelation`.
   *
   * @returns The NewBee instance's `AdminControlsRelation`.
   */
  async getAdminControlsRelation(): Promise<AdminControlsRelation> {
    const adminControls = await this.getAdminControls();
    const [waitlist, waitlistCount] = await this.em.findAndCount(
      WaitlistMemberEntity,
      { waitlist: adminControls },
      {
        offset: 0,
        limit: defaultLimit,
        orderBy: { createdAt: QueryOrder.ASC },
      },
    );
    return {
      adminControls,
      waitlist: {
        results: waitlist,
        total: waitlistCount,
        offset: 0,
        limit: defaultLimit,
      },
    };
  }

  /**
   * Check whether the given entity is safe to delete and throw a `BadRequestException` if it's not.
   *
   * @param entity The entity to check.
   *
   * @throws {BadRequestException} `cannotDeleteMaintainerBadRequest`, `cannotDeleteOnlyTeamOwnerBadRequest`, `cannotDeleteOnlyOrgOwnerBadRequest`. If trying to delete a user who's the only maintainer of a post, the only team owner, or the only org owner.
   */
  async safeToDelete(
    entity: OrgMemberEntity | TeamMemberEntity | UserEntity,
  ): Promise<void> {
    await this.em.populate(entity, true);
    if (entity instanceof OrgMemberEntity) {
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
   * Finds all of a given post type associated with the given org, and possibly a team.
   *
   * @param postType The post type to fetch.
   * @param offsetAndLimit The offset and limit to look for.
   * @param organization The organization whose posts to look for.
   * @param optionalParams All of the optional params for fetching posts.
   *
   * @returns A tuple containing the found post entities and a count of the total number of posts in the org.
   */
  async findPostsByOrgAndCount<PostType extends PostEntity>(
    postType: ClassConstructor<PostType>,
    offsetAndLimit: OffsetAndLimit,
    organization: OrganizationEntity,
    optionalParams?: {
      team?: TeamEntity;
      orgMember?: OrgMemberEntity;
      creator?: OrgMemberEntity;
      maintainer?: OrgMemberEntity;
    },
  ): Promise<[PostType[], number]> {
    const { offset, limit } = offsetAndLimit;
    const params = optionalParams ?? {};
    const { orgMember, ...restParams } = params;
    return await this.em.findAndCount(
      postType,
      {
        organization,
        ...(orgMember && {
          $or: [{ creator: orgMember }, { maintainer: orgMember }],
        }),
        ...(restParams && restParams),
      },
      { orderBy: { markedUpToDateAt: QueryOrder.DESC }, offset, limit },
    );
  }

  /**
   * Converts a `UserEntity` into a `PublicUser`.
   *
   * @param user The user entity to convert.
   *
   * @returns The user entity stripped of sensistive private information.
   */
  static createPublicUser(user: UserEntity): PublicUser {
    const { email, name, displayName, phoneNumber } = user;
    return { email, name, displayName, phoneNumber };
  }

  /**
   * Generate permissions using the given options.
   *
   * @param options The options to consider when examining permissions.
   *
   * @returns A permissions object based on the given options.
   */
  static permissionsFor(options: {
    adminControls?: AdminControlsEntity;
    orgMember?: OrgMemberEntity;
    teamMember?: TeamMemberEntity;
    user?: UserEntity;
  }): Permissions<OrizAction, OrizSubject> {
    const permissions = new Permissions<OrizAction, OrizSubject>();
    permissions.addActionAlias('all', ['create', 'read', 'update', 'delete']);
    const { adminControls, orgMember, teamMember, user } = options;

    // START: admin controls-related permissions

    if (adminControls) {
      // allow users to register if admin controls allow registration
      if (adminControls.allowRegistration) {
        permissions.allow('create', UserEntity);
      }

      // allow users to waitlist if admin controls allow waitlist  but does not allow registration
      else if (adminControls.allowWaitlist) {
        permissions.allow('create', WaitlistMemberEntity);
      }
    }

    // END: admin controls-related permissions

    // START: user-related permissions

    if (user) {
      // allow users to do all actions related to authenticators if it's their authenticator
      permissions.allow('all', AuthenticatorEntity, {
        conditional: (authenticator) => user.id === authenticator.user.id,
      });

      // allow users to read, update, and delete themselves
      permissions.allow(['read', 'update', 'delete'], UserEntity, {
        conditional: (subjectUser) => user.id === subjectUser.id,
      });

      // allow users to read their own invites object
      permissions.allow('read', UserInvitesEntity, {
        conditional: (userInvites) => user.id === userInvites.user?.id,
      });

      // allow users to create orgs
      permissions.allow('create', OrganizationEntity);

      // allow admins to read and update admin controls and do all actions on waitlist members
      if (user.role === UserRoleEnum.Admin) {
        permissions.allow(['read', 'update'], AdminControlsEntity);
        permissions.allow('all', WaitlistMemberEntity);
      }
    }

    // END: user-related permissions

    // START: org member-related permissions

    if (orgMember) {
      // allow all org members to read their org
      permissions.allow('read', OrganizationEntity, {
        conditional: (org) => orgMember.organization.id === org.id,
      });

      // allow all org members to read other org members in their org
      permissions.allow('read', OrgMemberEntity, {
        conditional: (subjectOrgMember) =>
          orgMember.organization.id === subjectOrgMember.organization.id,
      });

      // allow all org members to create org member invites in their org whose role is >= the invite's
      permissions.allow('create', OrgMemberInviteEntity, {
        conditional: (orgMemberInvite) =>
          orgMember.organization.id === orgMemberInvite.organization.id &&
          compareOrgRoles(orgMember.role, orgMemberInvite.role) >= 0,
      });

      // allow all org members to create and read org member invites in their org
      permissions.allow('read', OrgMemberInviteEntity, {
        conditional: (orgMemberInvite) =>
          orgMember.organization.id === orgMemberInvite.organization.id,
      });

      // allow all org members to create or read a team in their org
      permissions.allow(['create', 'read'], TeamEntity, {
        conditional: (team) =>
          orgMember.organization.id === team.organization.id,
      });

      // allow all org members to read other team members in their org
      permissions.allow('read', TeamMemberEntity, {
        conditional: (subjectTeamMember) =>
          orgMember.organization.id ===
          subjectTeamMember.orgMember.organization.id,
      });

      // allow all org members to create, read, or update a post in their org
      permissions.allow(['create', 'read', 'update'], [DocEntity, QnaEntity], {
        conditional: (post) =>
          orgMember.organization.id === post.organization.id,
      });

      if (compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0) {
        // only allow org moderators to update their org
        permissions.allow('update', OrganizationEntity, {
          conditional: (org) => orgMember.organization.id === org.id,
        });

        // only allow org moderators to update and delete org members in their org if their role is >= the subject's
        permissions.allow(['update', 'delete'], OrgMemberEntity, {
          conditional: (subjectOrgMember) =>
            orgMember.organization.id === subjectOrgMember.organization.id &&
            compareOrgRoles(orgMember.role, subjectOrgMember.role) >= 0,
        });

        // only allow org moderators to update and delete org member invites in their org
        permissions.allow(['update', 'delete'], OrgMemberInviteEntity, {
          conditional: (orgMemberInvite) =>
            orgMember.organization.id === orgMemberInvite.organization.id,
        });
      }

      if (orgMember.role === OrgRoleEnum.Owner) {
        // only allow org owners to delete their org
        permissions.allow('delete', OrganizationEntity, {
          conditional: (org) => orgMember.organization.id === org.id,
        });
      }
    }

    // END: org member-related permissions

    // START: bound-spanning permissions

    // allow org moderators and team moderators to update their teams or teams in their org
    permissions.allow('update', TeamEntity, {
      conditional: (team) =>
        !!(
          (orgMember &&
            orgMember.organization.id === team.organization.id &&
            compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0) ||
          (teamMember &&
            teamMember.team.id === team.id &&
            compareTeamRoles(teamMember.role, TeamRoleEnum.Moderator) >= 0)
        ),
    });

    // allow org moderators and team owners to update tehir teams or teams in their org
    permissions.allow('delete', TeamEntity, {
      conditional: (team) =>
        !!(
          (orgMember &&
            orgMember.organization.id === team.organization.id &&
            compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0) ||
          (teamMember &&
            teamMember.team.id === team.id &&
            teamMember.role === TeamRoleEnum.Owner)
        ),
    });

    // allow org moderators and any team member to create team members in their org/team
    permissions.allow('create', TeamMemberEntity, {
      conditional: (subjectTeamMember) =>
        !!(
          (orgMember &&
            orgMember.organization.id ===
              subjectTeamMember.orgMember.organization.id &&
            compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0) ||
          (teamMember &&
            teamMember.team.id === subjectTeamMember.team.id &&
            compareTeamRoles(teamMember.role, subjectTeamMember.role) >= 0)
        ),
    });

    // allow org moderators and team moderators to update other team members if their role >= the subject's
    permissions.allow(['update', 'delete'], TeamMemberEntity, {
      conditional: (subjectTeamMember) =>
        !!(
          (orgMember &&
            orgMember.organization.id ===
              subjectTeamMember.orgMember.organization.id &&
            compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0) ||
          (teamMember &&
            teamMember.team.id === subjectTeamMember.team.id &&
            compareTeamRoles(teamMember.role, TeamRoleEnum.Moderator) >= 0 &&
            compareTeamRoles(teamMember.role, subjectTeamMember.role) >= 0)
        ),
    });

    // allow org moderators, team moderators, and post maintainers to delete posts in their org/team
    permissions.allow('delete', [DocEntity, QnaEntity], {
      conditional: (post) =>
        !!(
          (orgMember &&
            orgMember.organization.id === post.organization.id &&
            (compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0 ||
              orgMember.id === post.maintainer?.id)) ||
          (teamMember &&
            teamMember.team.id === post.team?.id &&
            compareTeamRoles(teamMember.role, TeamRoleEnum.Moderator) >= 0)
        ),
    });

    // END: bound-spanning permissions

    permissions.lock();
    return permissions;
  }

  // END: Misc
}
