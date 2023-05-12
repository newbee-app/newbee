import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
} from '@nestjs/common';
import {
  OrgMemberService,
  UpdateOrgMemberDto,
} from '@newbee/api/org-member/data-access';
import {
  EntityService,
  OrganizationEntity,
  OrgMemberEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  Organization,
  OrgMember,
  Role,
  SubjectOrgMember,
  User,
} from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import {
  organizationUrl,
  orgMemberUrl,
  orgMemberVersion,
} from '@newbee/shared/data-access';
import type { OrgMemberNoUser, OrgMemberRelation } from '@newbee/shared/util';
import { OrgRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `OrgMemberEntity`.
 */
@Controller({
  path: `${organizationUrl}/:${organizationUrl}/${orgMemberUrl}`,
  version: orgMemberVersion,
})
export class OrgMemberController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(OrgMemberController.name);

  constructor(
    private readonly orgMemberService: OrgMemberService,
    private readonly entityService: EntityService,
    private readonly userService: UserService
  ) {}

  /**
   * The API route for getting the authenticated user's org member data and marking it as the selected organization.
   *
   * @param orgMember The org member to get and select.
   * @param organization The organization to look in.
   * @param user The authenticated user making the request.
   *
   * @returns Information about the selected org member.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Post()
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async getAndSelect(
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
    @User() user: UserEntity
  ): Promise<OrgMemberNoUser> {
    this.logger.log(
      `Get and select org member request received in organization ID: ${organization.id} by user ID: ${user.id}`
    );
    this.logger.log(`Found org member, slug: ${orgMember.slug}`);

    await this.userService.update(user, { selectedOrganization: orgMember });
    return await this.entityService.createOrgMemberRelation(orgMember);
  }

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
  @Get(`:${orgMemberUrl}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async getBySlug(
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity
  ): Promise<OrgMemberRelation> {
    this.logger.log(
      `Get org member request received in organization ID: ${organization.id}, for slug: ${subjectOrgMember.slug}`
    );
    this.logger.log(`Found org member, slug: ${subjectOrgMember.slug}`);
    return await this.entityService.createOrgMemberRelation(subjectOrgMember);
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
  @Patch(`:${orgMemberUrl}`)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async update(
    @Body() updateOrgMemberDto: UpdateOrgMemberDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity
  ): Promise<OrgMemberRelation> {
    this.logger.log(
      `Update org member request received in organization ID: ${organization.id}, for org member slug: ${subjectOrgMember.slug}, from org member slug: ${orgMember.slug}`
    );

    const { role } = updateOrgMemberDto;
    const updatedOrgMember = await this.orgMemberService.updateRole(
      subjectOrgMember,
      role,
      orgMember.role
    );
    this.logger.log(
      `Updated org member for org member slug: ${updatedOrgMember.slug}, in organization ID: ${organization.id}`
    );

    return await this.entityService.createOrgMemberRelation(updatedOrgMember);
  }

  /**
   * The API route for deleting an org member.
   *
   * @param orgMember The org member making the request.
   * @param subjectOrgMember The org member being affected.
   * @param organization The organization this is all happening in.
   */
  @Delete(`:${orgMemberUrl}`)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async delete(
    @OrgMember() orgMember: OrgMemberEntity,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity
  ): Promise<void> {
    this.logger.log(
      `Delete org member request received for org member slug: ${subjectOrgMember.slug}, from org member slug: ${orgMember.slug}, in organization ID: ${organization.id}`
    );
    await this.orgMemberService.delete(subjectOrgMember, orgMember.role);
    this.logger.log(
      `Deleted org member with slug: ${subjectOrgMember.slug}, in organization ID: ${organization.id}`
    );
  }
}
