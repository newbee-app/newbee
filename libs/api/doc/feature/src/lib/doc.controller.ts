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
  CreateDocDto,
  DocService,
  UpdateDocDto,
} from '@newbee/api/doc/data-access';
import {
  DocEntity,
  EntityService,
  OffsetDto,
  OrgMemberEntity,
  OrganizationEntity,
} from '@newbee/api/shared/data-access';
import { Doc, OrgMember, Organization, Role } from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseDocAndMemberDto,
  DocQueryResult,
  Keyword,
  Result,
  apiRoles,
} from '@newbee/shared/util';

/**
 * The controller that interacts with `DocEntity`.
 */
@Controller({
  path: `${Keyword.Organization}/:${Keyword.Organization}/${Keyword.Doc}`,
  version: apiVersion.doc,
})
export class DocController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(DocController.name);

  constructor(
    private readonly docService: DocService,
    private readonly entityService: EntityService,
    private readonly teamMemberService: TeamMemberService,
  ) {}

  /**
   * The API route for getting paginated results of all of the docs in an org.
   *
   * @param offsetDto The offset for the pagination.
   * @param organization The organization to look in.
   *
   * @returns The result containing the retrieved docs, the total number of docs in the org, and the offset we retrieved.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get()
  @Role(apiRoles.doc.getAllPaginated)
  async getAllPaginated(
    @Query() offsetDto: OffsetDto,
    @Organization() organization: OrganizationEntity,
  ): Promise<Result<DocQueryResult>> {
    this.logger.log(
      `Get docs and count request received for organization: ${organization.slug}`,
    );

    const { offset } = offsetDto;
    const [docs, total] = await this.docService.findByOrgAndCount(
      organization,
      offset,
    );
    this.logger.log(
      `Got docs for organization: ${organization.slug}, total count: ${total}`,
    );

    return {
      total,
      offset,
      results: await this.entityService.createDocQueryResults(docs),
    };
  }

  /**
   * The API route for creating a doc.
   *
   * @param createDocDto The information necessary to create a doc.
   * @param user The user that sent the request and will become the owner of the doc.
   * @param organization The organization the doc will go in.
   * @param teamSlugDto The DTO containing the slug of the team the doc will go in, if applicable.
   *
   * @returns The newly created doc.
   * @throws {NotFoundException} `teamSlugNotFound`. If the DTO specifies a team slug that cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post()
  @Role(apiRoles.doc.create)
  async create(
    @Body() createDocDto: CreateDocDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<DocEntity> {
    this.logger.log(
      `Create doc request received from org member slug: ${orgMember.slug}, in organization ID: ${organization.id}, with title: ${createDocDto.title}`,
    );
    const doc = await this.docService.create(createDocDto, orgMember);
    this.logger.log(
      `Doc created with ID: ${doc.id}, slug: ${doc.slug}, title: ${doc.title}`,
    );
    return doc;
  }

  /**
   * The API route for getting a doc.
   *
   * @param doc The doc we're looking for.
   * @param orgMember The org member making the request.
   *
   * @returns The doc associated with the slug, if one exists.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get(`:${Keyword.Doc}`)
  @Role(apiRoles.doc.get)
  async get(
    @Doc() doc: DocEntity,
    @OrgMember() orgMember: OrgMemberEntity,
  ): Promise<BaseDocAndMemberDto> {
    this.logger.log(`Get doc request received for slug: ${doc.slug}}`);
    this.logger.log(`Found doc, slug: ${doc.slug}, ID: ${doc.id}`);

    const { team } = doc;
    return {
      doc: await this.entityService.createDocNoOrg(doc),
      teamMember: team
        ? await this.teamMemberService.findOneByOrgMemberAndTeamOrNull(
            orgMember,
            team,
          )
        : null,
    };
  }

  /**
   * The API route for updating a doc.
   *
   * @param updateDocDto The new values for the doc.
   * @param doc The doc we're looking for.
   *
   * @returns The updated doc, if it was updated successfully.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Patch(`:${Keyword.Doc}`)
  @Role(apiRoles.doc.update)
  async update(
    @Body() updateDocDto: UpdateDocDto,
    @Doc() doc: DocEntity,
    @OrgMember() orgMember: OrgMemberEntity,
  ): Promise<BaseDocAndMemberDto> {
    this.logger.log(`Update doc request received for slug: ${doc.slug}`);
    const updatedDoc = await this.docService.update(doc, updateDocDto);
    this.logger.log(
      `Updated doc, slug: ${updatedDoc.slug}, ID: ${updatedDoc.id}`,
    );

    const { team } = updatedDoc;
    return {
      doc: await this.entityService.createDocNoOrg(updatedDoc),
      teamMember: team
        ? await this.teamMemberService.findOneByOrgMemberAndTeamOrNull(
            orgMember,
            team,
          )
        : null,
    };
  }

  /**
   * The API route for marking a doc as up-to-date.
   *
   * @param doc The doc we're looking for.
   *
   * @returns The updated doc, if it was updated successfully.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Post(`:${Keyword.Doc}`)
  @Role(apiRoles.doc.markUpToDate)
  async markUpToDate(@Doc() doc: DocEntity): Promise<DocEntity> {
    this.logger.log(`Mark up-to-date request received for slug: ${doc.slug}`);
    const updatedDoc = await this.docService.markUpToDate(doc);
    this.logger.log(
      `Marked doc up-to-date, slug: ${updatedDoc.slug}, ID: ${updatedDoc.id}`,
    );
    return updatedDoc;
  }

  /**
   * The API route for deleting a doc.
   *
   * @param doc The doc we're looking for.
   *
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Delete(`:${Keyword.Doc}`)
  @Role(apiRoles.doc.delete)
  async delete(@Doc() doc: DocEntity): Promise<void> {
    this.logger.log(`Delete doc request received for doc slug: ${doc.slug}`);
    await this.docService.delete(doc);
    this.logger.log(`Deleted doc, slug: ${doc.slug}, ID: ${doc.id}`);
  }
}
