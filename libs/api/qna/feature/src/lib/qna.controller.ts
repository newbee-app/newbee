import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateQnaDto,
  QnaService,
  UpdateAnswerDto,
  UpdateQuestionDto,
} from '@newbee/api/qna/data-access';
import {
  OrgMemberEntity,
  OrganizationEntity,
  QnaEntity,
  TeamEntity,
  TeamSlugDto,
} from '@newbee/api/shared/data-access';
import {
  ConditionalRoleEnum,
  OrgMember,
  Organization,
  PostRoleEnum,
  Qna,
  Role,
  Team,
} from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import { Keyword, OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `QnaEntity`.
 */
@Controller({
  path: `${Keyword.Organization}/:${Keyword.Organization}/${Keyword.Qna}`,
  version: apiVersion.qna,
})
export class QnaController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(QnaController.name);

  constructor(private readonly qnaService: QnaService) {}

  /**
   * The API route for creating a qna.
   * Organization members, moderators, and owners should be allowed to access this endpoint.
   *
   * @param createQnaDto The information necessary to create a qna.
   * @param orgMember The org member that sent the request and will become the asker of the qna.
   * @param organization The organization the qna will go in.
   * @param teamSlugDto The DTO containing the slug of the team the qna will go in, if applicable.
   *
   * @returns The newly created qna.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Post()
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async create(
    @Body() createQnaDto: CreateQnaDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity | undefined,
    @Query() teamSlugDto: TeamSlugDto,
  ): Promise<QnaEntity> {
    const { team: teamSlug } = teamSlugDto;
    this.logger.log(
      `Create qna request received from org member slug: ${
        orgMember.slug
      }, in organization ID: ${organization.id}${
        teamSlug ? `, in team: ${teamSlug}` : ''
      }, with title: ${createQnaDto.title}`,
    );
    const qna = await this.qnaService.create(
      createQnaDto,
      team ?? null,
      orgMember,
    );
    this.logger.log(
      `Qna created with ID: ${qna.id}, slug: ${qna.slug}, title: ${qna.title}`,
    );

    return qna;
  }

  /**
   * The API route for getting a qna.
   * Organization members, moderators, and owners should be allowed to access the endpoint.
   *
   * @param qna The qna we're looking for.
   *
   * @returns The qna associated with the slug, if one exists.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get(`:${Keyword.Qna}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(@Qna() qna: QnaEntity): Promise<QnaEntity> {
    this.logger.log(`Get qna request received for slug: ${qna.slug}`);
    this.logger.log(`Found qna, slug: ${qna.slug}, ID: ${qna.id}`);
    return qna;
  }

  /**
   * The API route for updating just the question portion of a qna.
   * Organization moderators and owners; team moderators and owners; and post creators and maintainers should be allowed to access the endpoint.
   *
   * @param updateQuestionDto The new values for the question.
   * @param qna The qna we're looking look for.
   *
   * @returns The updated qna, if it was updated successfully.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Patch(`:${Keyword.Qna}/${Keyword.Question}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Creator,
    PostRoleEnum.Maintainer,
  )
  async updateQuestion(
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Qna() qna: QnaEntity,
  ): Promise<QnaEntity> {
    this.logger.log(`Update question request received for slug: ${qna.slug}`);
    const updatedQna = await this.qnaService.update(qna, updateQuestionDto);
    this.logger.log(
      `Updated question, slug: ${updatedQna.slug}, ID: ${updatedQna.id}`,
    );
    return updatedQna;
  }

  /**
   * The API route for updating just the answer portion of a qna.
   * Organization moderators and owners; team members, moderators, and owners; and post maintainers should be allowed to access the endpoint.
   * Organization members should be allowed to access the endpoint if the qna is not associated with a team.
   *
   *
   * @param updateAnswerDto The new value for the answer.
   * @param qna The qna we're looking for.
   * @param orgMember The org member that sent the request and will become the maintainer if the qna doesn't already have a maintainer.
   *
   * @returns The updated qna, if it was updated successfully.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Patch(`:${Keyword.Qna}/${Keyword.Answer}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Member,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer,
    ConditionalRoleEnum.OrgMemberIfNoTeamInQna,
  )
  async updateAnswer(
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Qna() qna: QnaEntity,
    @OrgMember() orgMember: OrgMemberEntity,
  ): Promise<QnaEntity> {
    this.logger.log(`Update answer request received for slug: ${qna.slug}`);
    let updatedQna: QnaEntity;
    if (qna.maintainer) {
      updatedQna = await this.qnaService.update(qna, updateAnswerDto);
    } else {
      updatedQna = await this.qnaService.update(
        qna,
        updateAnswerDto,
        orgMember,
      );
    }
    this.logger.log(
      `Updated answer, slug: ${updatedQna.slug}, ID: ${updatedQna.id}`,
    );

    return updatedQna;
  }

  /**
   * The API route for marking a qna as up-to-date.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param qna The qna we're looking look for.
   *
   * @returns The updated qna, if it was updated successfully.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post(`:${Keyword.Qna}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer,
  )
  async markUpToDate(@Qna() qna: QnaEntity): Promise<QnaEntity> {
    this.logger.log(`Mark up-to-date request received for slug: ${qna.slug}`);
    const updatedQna = await this.qnaService.markUpToDate(qna);
    this.logger.log(
      `Marked qna up-to-date, slug: ${updatedQna.slug}, ID: ${updatedQna.id}`,
    );
    return updatedQna;
  }

  /**
   * The API route for deleting a qna.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param qna The qna we're looking look for.
   *
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${Keyword.Qna}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer,
  )
  async delete(@Qna() qna: QnaEntity): Promise<void> {
    this.logger.log(`Delete qna request received for qna slug: ${qna.slug}`);
    await this.qnaService.delete(qna);
    this.logger.log(`Deleted qna, slug: ${qna.slug}, ID: ${qna.id}`);
  }
}
