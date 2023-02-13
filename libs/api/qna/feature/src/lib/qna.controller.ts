import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  CreateQnaDto,
  QnaService,
  UpdateQnaDto,
} from '@newbee/api/qna/data-access';
import {
  QnaEntity,
  TeamSlugDto,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  OrgRoleEnum,
  PostRoleEnum,
  Role,
  TeamRoleEnum,
  User,
} from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  create,
  organization,
  qna,
  qnaVersion,
} from '@newbee/shared/data-access';

/**
 * The controller that interacts with `QnaEntity`.
 */
@Controller({ path: `:${organization}/${qna}`, version: qnaVersion })
export class QnaController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(QnaController.name);

  constructor(
    private readonly qnaService: QnaService,
    private readonly organizationService: OrganizationService,
    private readonly orgMemberService: OrgMemberService,
    private readonly teamService: TeamService
  ) {}

  /**
   * The API route for creating a qna.
   * Organization members, moderators, and owners should be allowed to access this endpoint.
   *
   * @param createQnaDto The information necessary to create a qna.
   * @param user The user that sent the request and will become the asker of the qna.
   * @param organizationSlug The slug of the organization the qna will go in.
   * @param teamSlugDto The DTO containing the slug of the team the qna will go in, if applicable.
   *
   * @returns The newly created qna.
   * @throws {NotFoundException} `organizationSlugNotFound`, `orgMemberNotFound`, `teamSlugNotFound`. If the organization slug cannot be found, the user does not exist in the organization, or the team does not exist in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(create)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async create(
    @Body() createQnaDto: CreateQnaDto,
    @User() user: UserEntity,
    @Param(organization) organizationSlug: string,
    @Query() teamSlugDto: TeamSlugDto
  ): Promise<QnaEntity> {
    const { teamSlug } = teamSlugDto;
    this.logger.log(
      `Create qna request received from user ID: ${
        user.id
      }, in organization: ${organizationSlug}${
        teamSlug ? `, in team: ${teamSlug}` : ''
      }, with title: ${createQnaDto.title}`
    );

    const organization = await this.organizationService.findOneBySlug(
      organizationSlug
    );
    const orgMember = await this.orgMemberService.findOneByUserAndOrg(
      user,
      organization
    );
    const team = teamSlug
      ? await this.teamService.findOneBySlug(organization, teamSlug)
      : null;
    const qna = await this.qnaService.create(createQnaDto, team, orgMember);
    this.logger.log(
      `Qna created with ID: ${qna.id}, slug: ${qna.slug}, title: ${qna.title}`
    );

    return qna;
  }

  /**
   * The API route for getting a qna.
   * Organization members, moderators, and owners should be allowed to access the endpoint.
   *
   * @param slug The slug to look for.
   *
   * @returns The qna associated with the slug, if one exists.
   * @throws {NotFoundException} `qnaSlugNotFound`. If the qna's slug could not be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${qna}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(@Param(qna) slug: string): Promise<QnaEntity> {
    this.logger.log(`Get qna request received for slug: ${slug}`);
    const qna = await this.qnaService.findOneBySlug(slug);
    this.logger.log(`Found qna, slug: ${slug}, ID: ${qna.id}`);
    return qna;
  }

  /**
   * The API route for updating a qna.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param slug The slug to look for.
   * @param updateQnaDto The new values for the qna.
   *
   * @returns The updated qna, if it was updated successfully.
   * @throws {NotFoundException} `qnaSlugNotFound`. If the qna's slug can't be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${qna}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async update(
    @Param(qna) slug: string,
    @Body() updateQnaDto: UpdateQnaDto
  ): Promise<QnaEntity> {
    this.logger.log(`Update qna request received for slug: ${slug}`);

    const qna = await this.qnaService.findOneBySlug(slug);
    const updatedQna = await this.qnaService.update(qna, updateQnaDto);
    this.logger.log(
      `Updated qna, slug: ${updatedQna.slug}, ID: ${updatedQna.id}`
    );

    return updatedQna;
  }

  /**
   * The API route for deleting a qna.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param slug The slug to look for.
   *
   * @throws {NotFoundException} `qnaSlugNotFound`. If the qna's slug can't be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${qna}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async delete(@Param(qna) slug: string): Promise<void> {
    this.logger.log(`Delete qna request received for qna slug: ${slug}`);
    const qna = await this.qnaService.findOneBySlug(slug);
    await this.qnaService.delete(qna);
    this.logger.log(`Deleted qna, slug: ${slug}, ID: ${qna.id}`);
  }
}
