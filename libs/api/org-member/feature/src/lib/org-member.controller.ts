import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationGuard } from '@newbee/api/organization/data-access';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import { Organization, Role } from '@newbee/api/shared/util';
import {
  BaseOrgMemberDto,
  organization,
  orgMemberVersion,
  user,
} from '@newbee/shared/data-access';
import { OrgRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `OrgMemberEntity`.
 */
@Controller({
  path: `${organization}/:${organization}/${user}`,
  version: orgMemberVersion,
})
@UseGuards(OrganizationGuard)
export class OrgMemberController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(OrgMemberController.name);

  constructor(private readonly orgMemberService: OrgMemberService) {}

  /**
   * Gets an org member.
   *
   * @param organization The organization to look in.
   * @param slug The org member slug to look for.
   *
   * @returns Information about the org member;
   * @throws {NotFoundException} `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Get(`:${user}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(
    @Organization() organization: OrganizationEntity,
    @Param(user) slug: string
  ): Promise<BaseOrgMemberDto> {
    this.logger.log(
      `Get org member request received in organization ID: ${organization.id}, for slug: ${slug}`
    );
    const orgMember = await this.orgMemberService.findOneByOrgAndSlug(
      organization,
      slug
    );
    this.logger.log(`Found org member, slug: ${slug}`);
    return await this.orgMemberService.createOrgMemberDto(orgMember);
  }
}
