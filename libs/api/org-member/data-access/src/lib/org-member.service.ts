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
  OrgMemberEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { BaseOrgMemberDto } from '@newbee/shared/data-access';
import {
  internalServerError,
  orgMemberNotFound,
  OrgRoleEnum,
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
    @InjectRepository(OrgMemberEntity)
    private readonly orgMemberRepository: EntityRepository<OrgMemberEntity>,
    private readonly solrCli: SolrCli
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
    role: OrgRoleEnum
  ): Promise<OrgMemberEntity> {
    const orgMember = new OrgMemberEntity(user, organization, role);
    try {
      await this.orgMemberRepository.persistAndFlush(orgMember);
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
        await orgMember.createOrgMemberDocParams()
      );
    } catch (err) {
      this.logger.error(err);
      await this.orgMemberRepository.removeAndFlush(orgMember);
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
    organization: OrganizationEntity
  ): Promise<OrgMemberEntity> {
    try {
      return await this.orgMemberRepository.findOneOrFail({
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
    slug: string
  ): Promise<OrgMemberEntity> {
    try {
      return await this.orgMemberRepository.findOneOrFail({
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
   * Updates the role of the given org member.
   *
   * @param orgMember The org member to update.
   * @param newRole The new role for the org member.
   *
   * @returns The udpated org member.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async updateRole(
    orgMember: OrgMemberEntity,
    newRole: OrgRoleEnum
  ): Promise<OrgMemberEntity> {
    const updatedOrgMember = this.orgMemberRepository.assign(orgMember, {
      role: newRole,
    });

    try {
      await this.orgMemberRepository.flush();
      return updatedOrgMember;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given org member.
   *
   * @param orgMember The org member to delete.
   *
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(orgMember: OrgMemberEntity): Promise<void> {
    try {
      await this.orgMemberRepository.removeAndFlush(orgMember);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const collectionName = orgMember.organization.id;
    try {
      await this.solrCli.deleteDocs(collectionName, { id: orgMember.slug });
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Takes in an org member and converts it to a `BaseOrgMemberDto`.
   *
   * @param orgMember The org member to convert.
   *
   * @returns The org member as a `BaseOrgMemberDto`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async createOrgMemberDto(
    orgMember: OrgMemberEntity
  ): Promise<BaseOrgMemberDto> {
    try {
      await this.orgMemberRepository.populate(orgMember, [
        'user',
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
      role,
      slug,
      user,
      teams,
      createdDocs,
      maintainedDocs,
      createdQnas,
      maintainedQnas,
    } = orgMember;
    const { email, name, displayName, phoneNumber, active } = user;

    return {
      role,
      slug,
      email,
      name,
      displayName,
      phoneNumber,
      active,
      teams: teams.getItems().map((teamMember) => {
        const { role, team } = teamMember;
        const { name, slug } = team;
        return { name, slug, role };
      }),
      createdDocs: createdDocs.getItems(),
      maintainedDocs: maintainedDocs.getItems(),
      createdQnas: createdQnas.getItems(),
      maintainedQnas: maintainedQnas.getItems(),
    };
  }
}
