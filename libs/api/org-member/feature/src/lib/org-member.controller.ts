import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Query,
} from '@nestjs/common';
import {
  GetOrgMemberPostsDto,
  OrgMemberService,
  UpdateOrgMemberDto,
} from '@newbee/api/org-member/data-access';
import {
  DocEntity,
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
  QnaEntity,
} from '@newbee/api/shared/data-access';
import {
  OrgMember,
  Organization,
  Role,
  SubjectOrgMember,
} from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import {
  DocQueryResult,
  Keyword,
  OrgMemberNoOrg,
  PaginatedResults,
  QnaQueryResult,
  apiRoles,
} from '@newbee/shared/util';

/**
 * The controller that interacts with `OrgMemberEntity`.
 */
@Controller({
  path: `${Keyword.Organization}/:${Keyword.Organization}/${Keyword.Member}`,
  version: apiVersion['org-member'],
})
export class OrgMemberController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(OrgMemberController.name);

  constructor(
    private readonly orgMemberService: OrgMemberService,
    private readonly entityService: EntityService,
  ) {}

  /**
   * The API route for getting an org member.
   *
   * @param subjectOrgMember The org member we're looking for.
   * @param organization The organization to look in.
   *
   * @returns Information about the org member;
   * @throws {NotFoundException} `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Get(`:${Keyword.Member}`)
  @Role(apiRoles['org-member'].getBySlug)
  async getBySlug(
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<OrgMemberNoOrg> {
    this.logger.log(
      `Get org member request received in organization ID: ${organization.id}, for slug: ${subjectOrgMember.slug}`,
    );
    this.logger.log(`Found org member, slug: ${subjectOrgMember.slug}`);
    return await this.entityService.createOrgMemberNoOrg(subjectOrgMember);
  }

  /**
   * The API route for updating the role of an org member.
   *
   * @param updateOrgMemberDto The new role for the org member.
   * @param orgMember The org member making the request.
   * @param subjectOrgMember The org member being affected.
   * @param organization The organization this is all happening in.
   *
   * @returns Information about the updated org member.
   */
  @Patch(`:${Keyword.Member}`)
  @Role(apiRoles['org-member'].update)
  async update(
    @Body() updateOrgMemberDto: UpdateOrgMemberDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<OrgMemberEntity> {
    this.logger.log(
      `Update org member request received in organization ID: ${organization.id}, for org member slug: ${subjectOrgMember.slug}, from org member slug: ${orgMember.slug}`,
    );

    const { role } = updateOrgMemberDto;
    const updatedOrgMember = await this.orgMemberService.updateRole(
      subjectOrgMember,
      role,
      orgMember.role,
    );
    this.logger.log(
      `Updated org member for org member slug: ${updatedOrgMember.slug}, in organization ID: ${organization.id}`,
    );

    return updatedOrgMember;
  }

  /**
   * The API route for deleting an org member.
   *
   * @param orgMember The org member making the request.
   * @param subjectOrgMember The org member being affected.
   * @param organization The organization this is all happening in.
   */
  @Delete(`:${Keyword.Member}`)
  @Role(apiRoles['org-member'].delete)
  async delete(
    @OrgMember() orgMember: OrgMemberEntity,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<void> {
    this.logger.log(
      `Delete org member request received for org member slug: ${subjectOrgMember.slug}, from org member slug: ${orgMember.slug}, in organization ID: ${organization.id}`,
    );
    await this.orgMemberService.delete(subjectOrgMember);
    this.logger.log(
      `Deleted org member with slug: ${subjectOrgMember.slug}, in organization ID: ${organization.id}`,
    );
  }

  /**
   * The API route for getting paginated results for all the docs of an org member.
   *
   * @param getOrgMemberPostsDto The offset, limit, and role to look for.
   * @param subjectOrgMember The org member whose docs to look for.
   * @param organization The organization to look in.
   *
   * @returns The result containing the retrieved docs, the total number of docs in the team, and the offset we retrieved.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get(`:${Keyword.Member}/${Keyword.Doc}`)
  @Role(apiRoles['org-member'].getAllDocs)
  async getAllDocs(
    @Query() getOrgMemberPostsDto: GetOrgMemberPostsDto,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<PaginatedResults<DocQueryResult>> {
    const { offset, limit, role } = getOrgMemberPostsDto;
    this.logger.log(
      `Get org member docs request received for org member slug: ${subjectOrgMember.slug} with role: ${role}, in organization ID: ${organization.id}, with offset: ${offset} and limit: ${limit}`,
    );

    const [docs, total] = await this.entityService.findPostsByOrgAndCount(
      DocEntity,
      { offset, limit },
      organization,
      {
        ...(!role
          ? { orgMember: subjectOrgMember }
          : role === 'creator'
          ? { creator: subjectOrgMember }
          : { maintainer: subjectOrgMember }),
      },
    );
    this.logger.log(
      `Get docs for org member slug: ${subjectOrgMember.slug} with role: ${role}, in organization ID: ${organization.id}, total count: ${total}`,
    );

    return {
      offset,
      limit,
      total,
      results: await this.entityService.createDocQueryResults(docs),
    };
  }

  /**
   * The API route for getting paginated results for all the qnas of an org member.
   *
   * @param getOrgMemberPostsDto The offset, limit, and role to look for.
   * @param subjectOrgMember The org member whose qnas to look for.
   * @param organization The organization to look in.
   *
   * @returns The result containing the retrieved qnas, the total number of qnas in the team, and the offset we retrieved.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get(`:${Keyword.Member}/${Keyword.Qna}`)
  @Role(apiRoles['org-member'].getAllQnas)
  async getAllQnas(
    @Query() getOrgMemberPostsDto: GetOrgMemberPostsDto,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<PaginatedResults<QnaQueryResult>> {
    const { offset, limit, role } = getOrgMemberPostsDto;
    this.logger.log(
      `Get org member qnas request received for org member slug: ${subjectOrgMember.slug} with role: ${role}, in organization ID: ${organization.id}, with offset: ${offset} and limit: ${limit}`,
    );

    const [qnas, total] = await this.entityService.findPostsByOrgAndCount(
      QnaEntity,
      { offset, limit },
      organization,
      {
        ...(!role
          ? { orgMember: subjectOrgMember }
          : role === 'creator'
          ? { creator: subjectOrgMember }
          : { maintainer: subjectOrgMember }),
      },
    );
    this.logger.log(
      `Get qnas for org member slug: ${subjectOrgMember.slug} with role: ${role}, in organization ID: ${organization.id}, total count: ${total}`,
    );

    return {
      offset,
      limit,
      total,
      results: await this.entityService.createQnaQueryResults(qnas),
    };
  }
}
