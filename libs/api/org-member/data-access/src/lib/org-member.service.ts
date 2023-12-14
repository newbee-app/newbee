import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  OrgRoleEnum,
  forbiddenError,
  generateLteOrgRoles,
  internalServerError,
  orgMemberNotFound,
  userAlreadyOrgMemberBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';

/**
 * The service that interacts with `OrgMemberEntity`.
 */
@Injectable()
export class OrgMemberService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(OrgMemberService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly entityService: EntityService,
    private readonly solrCli: SolrCli,
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
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async create(
    user: UserEntity,
    organization: OrganizationEntity,
    role: OrgRoleEnum,
  ): Promise<OrgMemberEntity> {
    const orgMember = new OrgMemberEntity(user, organization, role);
    try {
      await this.em.persistAndFlush(orgMember);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(userAlreadyOrgMemberBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }

    try {
      await this.solrCli.addDocs(
        organization.id,
        await this.entityService.createOrgMemberDocParams(orgMember),
      );
    } catch (err) {
      this.logger.error(err);
      await this.em.removeAndFlush(orgMember);
      throw new InternalServerErrorException(internalServerError);
    }

    return orgMember;
  }

  /**
   * Finds the `OrgMemberEntity` associated with the given user and organization.
   *
   * @param user The user to search for.
   * @param organization The organization to search in.
   *
   * @returns The associated `OrgMemberEntity` instance.
   * @throws {NotFoundException} `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByUserAndOrg(
    user: UserEntity,
    organization: OrganizationEntity,
  ): Promise<OrgMemberEntity> {
    try {
      return await this.em.findOneOrFail(OrgMemberEntity, {
        user,
        organization,
      });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(orgMemberNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `OrgMemberEntity` associated with the given organization and slug.
   *
   * @param organization The organization to search in.
   * @param slug The slug to search for.
   *
   * @returns The associated `OrgMemberEntity` instance.
   * @throws {NotFoundException} `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByOrgAndSlug(
    organization: OrganizationEntity,
    slug: string,
  ): Promise<OrgMemberEntity> {
    try {
      return await this.em.findOneOrFail(OrgMemberEntity, {
        organization,
        slug,
      });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundError(orgMemberNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the `OrgMemberEntity` associated with the given user and organization, returns null if it doesn't exist.
   *
   * @param user The user to search for.
   * @param organization The organization to search in.
   *
   * @returns The associated `OrgMemberEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByUserAndOrgOrNull(
    user: UserEntity,
    organization: OrganizationEntity,
  ): Promise<OrgMemberEntity | null> {
    try {
      return await this.em.findOne(OrgMemberEntity, {
        user,
        organization,
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
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
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async updateRole(
    orgMember: OrgMemberEntity,
    newRole: OrgRoleEnum,
    requesterOrgRole: OrgRoleEnum,
  ): Promise<OrgMemberEntity> {
    OrgMemberService.checkRequesterOrgRole(requesterOrgRole, newRole);
    const updatedOrgMember = this.em.assign(orgMember, {
      role: newRole,
    });

    try {
      await this.em.flush();
      return updatedOrgMember;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given org member.
   *
   * If the org member is the only owner of the org, throw a `BadRequestException`.
   *
   * @param orgMember The org member to delete.
   *
   * @throws {BadRequestException} `cannotDeleteOnlyOwnerBadRequest`. If the org member is the only owner of the team.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(orgMember: OrgMemberEntity): Promise<void> {
    const collectionName = orgMember.organization.id;
    const id = orgMember.slug;
    await this.entityService.safeToDelete(orgMember);

    try {
      await this.em.removeAndFlush(orgMember);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    // Handle deleting the org member in Solr

    try {
      await this.solrCli.deleteDocs(collectionName, { id });
    } catch (err) {
      this.logger.error(err);
    }
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
