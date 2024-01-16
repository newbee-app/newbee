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
  EntityService,
  OffsetAndLimitDto,
  OrgMemberEntity,
  OrganizationEntity,
  QnaEntity,
} from '@newbee/api/shared/data-access';
import { OrgMember, Organization, Qna, Role } from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseQnaAndMemberDto,
  Keyword,
  PaginatedResults,
  QnaQueryResult,
  apiRoles,
} from '@newbee/shared/util';

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

  constructor(
    private readonly qnaService: QnaService,
    private readonly entityService: EntityService,
    private readonly teamMemberService: TeamMemberService,
  ) {}

  /**
   * The API route for getting paginated results of all of the qnas in an org.
   *
   * @param offsetAndLimitDto The offset and limit for the pagination.
   * @param organization The organization to look in.
   *
   * @returns The result containing the retrieved qnas, the total number of qnas in the org, and the offset we retrieved.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get()
  @Role(apiRoles.qna.getAllPaginated)
  async getAllPaginated(
    @Query() offsetAndLimitDto: OffsetAndLimitDto,
    @Organization() organization: OrganizationEntity,
  ): Promise<PaginatedResults<QnaQueryResult>> {
    this.logger.log(
      `Get all paginated qnas request received for organization: ${organization.slug}`,
    );

    const [qnas, total] = await this.qnaService.findByOrgAndCount(
      organization,
      offsetAndLimitDto,
    );
    this.logger.log(
      `Got qnas for organization: ${organization.slug}, total count: ${total}`,
    );

    return {
      ...offsetAndLimitDto,
      total,
      results: await this.entityService.createQnaQueryResults(qnas),
    };
  }

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
  @Role(apiRoles.qna.create)
  async create(
    @Body() createQnaDto: CreateQnaDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<QnaEntity> {
    this.logger.log(
      `Create qna request received from org member slug: ${orgMember.slug}, in organization ID: ${organization.id}, with title: ${createQnaDto.title}`,
    );
    const qna = await this.qnaService.create(createQnaDto, orgMember);
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
   * @param orgMember The org member making the request.
   *
   * @returns The qna associated with the slug, if one exists.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get(`:${Keyword.Qna}`)
  @Role(apiRoles.qna.get)
  async get(
    @Qna() qna: QnaEntity,
    @OrgMember() orgMember: OrgMemberEntity,
  ): Promise<BaseQnaAndMemberDto> {
    this.logger.log(`Get qna request received for slug: ${qna.slug}`);
    this.logger.log(`Found qna, slug: ${qna.slug}, ID: ${qna.id}`);

    const { team } = qna;
    return {
      qna: await this.entityService.createQnaNoOrg(qna),
      teamMember: team
        ? await this.teamMemberService.findOneByOrgMemberAndTeamOrNull(
            orgMember,
            team,
          )
        : null,
    };
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
  @Role(apiRoles.qna.updateQuestion)
  async updateQuestion(
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Qna() qna: QnaEntity,
    @OrgMember() orgMember: OrgMemberEntity,
  ): Promise<BaseQnaAndMemberDto> {
    this.logger.log(`Update question request received for slug: ${qna.slug}`);
    const updatedQna = await this.qnaService.update(qna, updateQuestionDto);
    this.logger.log(
      `Updated question, slug: ${updatedQna.slug}, ID: ${updatedQna.id}`,
    );

    const { team } = updatedQna;
    return {
      qna: await this.entityService.createQnaNoOrg(updatedQna),
      teamMember: team
        ? await this.teamMemberService.findOneByOrgMemberAndTeamOrNull(
            orgMember,
            team,
          )
        : null,
    };
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
  @Role(apiRoles.qna.updateAnswer)
  async updateAnswer(
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Qna() qna: QnaEntity,
  ): Promise<QnaEntity> {
    this.logger.log(`Update answer request received for slug: ${qna.slug}`);
    const updatedQna = await this.qnaService.update(qna, updateAnswerDto);
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
  @Role(apiRoles.qna.markUpToDate)
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
  @Role(apiRoles.qna.delete)
  async delete(@Qna() qna: QnaEntity): Promise<void> {
    this.logger.log(`Delete qna request received for qna slug: ${qna.slug}`);
    await this.qnaService.delete(qna);
    this.logger.log(`Deleted qna, slug: ${qna.slug}, ID: ${qna.id}`);
  }
}
