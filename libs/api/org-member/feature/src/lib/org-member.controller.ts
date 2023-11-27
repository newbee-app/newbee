import { Body, Controller, Delete, Get, Logger, Patch } from '@nestjs/common';
import {
  OrgMemberService,
  UpdateOrgMemberDto,
} from '@newbee/api/org-member/data-access';
import {
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
} from '@newbee/api/shared/data-access';
import {
  ConditionalRoleEnum,
  OrgMember,
  Organization,
  Role,
  SubjectOrgMember,
} from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import { Keyword, OrgMemberNoOrg, OrgRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `OrgMemberEntity`.
 */
@Controller({
  path: `${Keyword.Organization}/:${Keyword.Organization}/${Keyword.Member}`,
  version: apiVersion.orgMember,
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
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
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
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    ConditionalRoleEnum.OrgRoleGteSubject,
  )
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
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    ConditionalRoleEnum.OrgRoleGteSubject,
  )
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
}
