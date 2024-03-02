import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityService,
  OrgMemberDocParams,
  OrgMemberEntity,
  OrganizationEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  OrgRoleEnum,
  forbiddenError,
  generateLteOrgRoles,
  orgMemberNotFound,
  userAlreadyOrgMemberBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';

/**
 * The service that interacts with `OrgMemberEntity`.
 */
@Injectable()
export class OrgMemberService {
  private readonly logger = new Logger(OrgMemberService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly solrCli: SolrCli,
    private readonly entityService: EntityService,
  ) {}

  /**
   * Creates a new `OrgMemberEntity` using the given `UserEntity` and `OrganizationEntity`.
   *
   * @param user The `UserEntity` to associate.
   * @param organization The `OrganizationEntity` to associate.
   * @param role The role the user will have in the organization.
   *
   * @returns A new `OrgMemberEntity` instance.
   * @throws {BadRequestException} `userAlreadyOrgMemberBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async create(
    user: UserEntity,
    organization: OrganizationEntity,
    role: OrgRoleEnum,
  ): Promise<OrgMemberEntity> {
    return await this.em.transactional(async (em): Promise<OrgMemberEntity> => {
      const orgMember = new OrgMemberEntity(user, organization, role);
      try {
        await em.persistAndFlush(orgMember);
      } catch (err) {
        if (err instanceof UniqueConstraintViolationException) {
          this.logger.error(err);
          throw new BadRequestException(userAlreadyOrgMemberBadRequest);
        }

        throw err;
      }
      await this.solrCli.addDocs(
        organization.id,
        new OrgMemberDocParams(orgMember),
      );
      return orgMember;
    });
  }

  /**
   * Finds the `OrgMemberEntity` associated with the given user and organization.
   *
   * @param user The user to search for.
   * @param organization The organization to search in.
   *
   * @returns The associated `OrgMemberEntity` instance.
   * @throws {NotFoundException} `orgMemberNotFound`. If the org member cannot be found.
   */
  async findOneByOrgAndUser(
    user: UserEntity,
    organization: OrganizationEntity,
  ): Promise<OrgMemberEntity> {
    const orgMember = await this.em.findOne(OrgMemberEntity, {
      user,
      organization,
    });
    if (!orgMember) {
      throw new NotFoundException(orgMemberNotFound);
    }
    return orgMember;
  }

  /**
   * Finds the `OrgMemberEntity` associated with the given user and organization, returns null if it doesn't exist.
   *
   * @param user The user to search for.
   * @param organization The organization to search in.
   *
   * @returns The associated `OrgMemberEntity` instance, `null` if it doesn't exist.
   */
  async findOneByOrgAndUserOrNull(
    user: UserEntity,
    organization: OrganizationEntity,
  ): Promise<OrgMemberEntity | null> {
    return await this.em.findOne(OrgMemberEntity, {
      user,
      organization,
    });
  }

  /**
   * Finds the `OrgMemberEntity` associated with the given organization and slug.
   *
   * @param organization The organization to search in.
   * @param slug The slug to search for.
   *
   * @returns The associated `OrgMemberEntity` instance.
   * @throws {NotFoundException} `orgMemberNotFound`. If the org member cannot be found.
   */
  async findOneByOrgAndSlug(
    organization: OrganizationEntity,
    slug: string,
  ): Promise<OrgMemberEntity> {
    const orgMember = await this.em.findOne(OrgMemberEntity, {
      organization,
      slug,
    });
    if (!orgMember) {
      throw new NotFoundException(orgMemberNotFound);
    }
    return orgMember;
  }

  /**
   * Updates the role of the given org member.
   *
   * @param orgMember The org member to update.
   * @param newRole The new role for the org member.
   * @param requesterOrgRole The org role of the requester.
   *
   * @returns The udpated org member.
   * @throws {ForbiddenException} `forbiddenError`. If the user is trying to update an org member with permissions that exceed their own.
   */
  async updateRole(
    orgMember: OrgMemberEntity,
    newRole: OrgRoleEnum,
    requesterOrgRole: OrgRoleEnum,
  ): Promise<OrgMemberEntity> {
    OrgMemberService.checkRequesterOrgRole(requesterOrgRole, newRole);
    return await this.em.transactional(async (em): Promise<OrgMemberEntity> => {
      orgMember = em.assign(orgMember, {
        role: newRole,
      });
      await em.flush();
      await this.solrCli.getVersionAndReplaceDocs(
        orgMember.organization.id,
        new OrgMemberDocParams(orgMember),
      );
      return orgMember;
    });
  }

  /**
   * Deletes the given org member.
   *
   * If the org member is the only owner of the org, throw a `BadRequestException`.
   *
   * @param orgMember The org member to delete.
   *
   * @throws {BadRequestException} `cannotDeleteOnlyOwnerBadRequest`. If the org member is the only owner of the team.
   */
  async delete(orgMember: OrgMemberEntity): Promise<void> {
    const { id } = orgMember;
    await this.entityService.safeToDelete(orgMember);
    await this.em.transactional(async (em): Promise<void> => {
      await em.removeAndFlush(orgMember);
      await this.solrCli.deleteDocs(orgMember.organization.id, { id });
    });
  }

  /**
   * Checks the requester's roles to see if the operation is permissible.
   * The requester shouldn't be allowed to affect a role higher than theirs.
   *
   * @param requesterOrgRole The requester's org role.
   * @param subjectRole The affected role.
   *
   * @throws {ForbiddenException} `forbiddenError`. If the operation isn't permissible.
   */
  static checkRequesterOrgRole(
    requesterOrgRole: OrgRoleEnum,
    subjectRole: OrgRoleEnum,
  ): void {
    if (generateLteOrgRoles(requesterOrgRole).includes(subjectRole)) {
      return;
    }

    throw new ForbiddenException(forbiddenError);
  }
}
