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
  TeamNameDto,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { organizationName, postSlug, User } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import { create, qna, qnaVersion } from '@newbee/shared/data-access';

/**
 * The controller that interacts with `QnaEntity`.
 */
@Controller({ path: `:${organizationName}/${qna}`, version: qnaVersion })
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
   *
   * @param createQnaDto The information necessary to create a qna.
   * @param user The user that sent the request and will become the asker of the qna.
   * @param organizationName The name of the organization the qna will go in.
   * @param teamName The name of the team teh qna will go in, if applicable.
   *
   * @returns The newly created qna.
   * @throws {BadRequestException} `qnaSlugTakenBadRequest`. If the slug is already taken in the organization.
   * @throws {NotFoundException} `organizationNameNotFound`, `orgMemberNotFound`, `teamNameNotFound`. If the organization name cannot be found, the user does not exist in the organization, or the team does not exist in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(create)
  async create(
    @Body() createQnaDto: CreateQnaDto,
    @User() user: UserEntity,
    @Param(organizationName) organizationName: string,
    @Query() teamNameDto: TeamNameDto
  ): Promise<QnaEntity> {
    // TODO: implement access controls here
    const { teamName } = teamNameDto;
    this.logger.log(
      `Create qna request received from user ID: ${user.id}, with slug: ${
        createQnaDto.slug
      }, in organization: ${organizationName}${
        teamName ? `, in team: ${teamName}` : ''
      }`
    );

    const organization = await this.organizationService.findOneByName(
      organizationName
    );
    const orgMember = await this.orgMemberService.findOneByUserAndOrg(
      user,
      organization
    );
    const team = teamName
      ? await this.teamService.findOneByName(organization, teamName)
      : null;
    const qna = await this.qnaService.create(createQnaDto, team, orgMember);
    this.logger.log(`Qna created with slug: ${qna.slug}, ID: ${qna.id}`);

    return qna;
  }

  /**
   * The API route for getting a qna.
   *
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   *
   * @returns The qna associated with the slug in the organization, if one exists.
   * @throws {NotFoundException} `organizationNameNotFound`, `qnaSlugNotFound`. If the organization name cannot be found or if the qna's slug could not be found in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${postSlug}`)
  async get(
    @Param(organizationName) organizationName: string,
    @Param(postSlug) slug: string
  ): Promise<QnaEntity> {
    // TODO: implement access controls here
    this.logger.log(
      `Get qna request received for slug: ${slug}, in organization: ${organizationName}`
    );

    const qna = await this.getQna(organizationName, slug);
    this.logger.log(`Found qna, slug: ${slug}, ID: ${qna.id}`);

    return qna;
  }

  /**
   * The API route for updating a qna.
   *
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   * @param updateQnaDto The new values for the qna.
   *
   * @returns The updated qna, if it was updated successfully.
   * @throws {NotFoundException} `organizationNameNotFound`, `qnaSlugNotFound`. If the organization can't be found of if the qna's slug can't be found in the organization.
   * @throws {BadRequestException} `qnaSlugTakenBadRequest`. If the qna's slug is being updated and is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${postSlug}`)
  async update(
    @Param(organizationName) organizationName: string,
    @Param(postSlug) slug: string,
    @Body() updateQnaDto: UpdateQnaDto
  ): Promise<QnaEntity> {
    // TODO: implement access controls here
    this.logger.log(
      `Update qna request received for slug: ${slug}, in organization: ${organizationName}, with values: ${JSON.stringify(
        updateQnaDto
      )}`
    );

    const qna = await this.getQna(organizationName, slug);
    const updatedQna = await this.qnaService.update(qna, updateQnaDto);
    this.logger.log(
      `Updated qna, slug: ${updatedQna.slug}, ID: ${updatedQna.id}`
    );

    return updatedQna;
  }

  /**
   * The API route for deleting a qna.
   *
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   */
  @Delete(`:${postSlug}`)
  async delete(
    @Param(organizationName) organizationName: string,
    @Param(postSlug) slug: string
  ): Promise<void> {
    // TODO: implement access controls here
    this.logger.log(
      `Delete qna request received for qna slug: ${slug}, in organization: ${organizationName}`
    );
    const qna = await this.getQna(organizationName, slug);
    await this.qnaService.delete(qna);
    this.logger.log(`Deleted qna, slug: ${slug}, ID: ${qna.id}`);
  }

  /**
   * Finds the qna with the given slug in the organization.
   *
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   *
   * @returns The associated qna, if it exists.
   * @throws {NotFoundException} `organizationNameNotFound`, `qnaSlugNotFound`. If the organization or slug cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  private async getQna(
    organizationName: string,
    slug: string
  ): Promise<QnaEntity> {
    const organization = await this.organizationService.findOneByName(
      organizationName
    );
    return await this.qnaService.findOneBySlug(organization, slug);
  }
}
