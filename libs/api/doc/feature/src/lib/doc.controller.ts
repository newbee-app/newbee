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
  OrganizationEntity,
  OrgMemberEntity,
  TeamEntity,
  TeamSlugDto,
} from '@newbee/api/shared/data-access';
import {
  ConditionalRoleEnum,
  Doc,
  Organization,
  OrgMember,
  PostRoleEnum,
  Role,
  Team,
} from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import { Keyword, OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';

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

  constructor(private readonly docService: DocService) {}

  /**
   * The API route for creating a doc.
   * Org moderators and owners; and team members, moderators, and owners should be allowed to access the endpoint.
   * Org members should be allowed to access the endpoint if no team was specified in the request's query or body.
   *
   * @param createDocDto The information necessary to create a doc.
   * @param user The user that sent the request and will become the owner of the doc.
   * @param organization The organization the doc will go in.
   * @param teamSlugDto The DTO containing the slug of the team the doc will go in, if applicable.
   *
   * @returns The newly created doc.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post()
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Member,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    ConditionalRoleEnum.OrgMemberIfNoTeamInReq
  )
  async create(
    @Body() createDocDto: CreateDocDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity | undefined,
    @Query() teamSlugDto: TeamSlugDto
  ): Promise<DocEntity> {
    const { team: teamSlug } = teamSlugDto;
    this.logger.log(
      `Create doc request received from org member slug: ${
        orgMember.slug
      }, in organization ID: ${organization.id}${
        teamSlug ? `, in team: ${teamSlug}` : ''
      }, with title: ${createDocDto.title}`
    );
    const doc = await this.docService.create(
      createDocDto,
      team ?? null,
      orgMember
    );
    this.logger.log(
      `Doc created with ID: ${doc.id}, slug: ${doc.slug}, title: ${doc.title}`
    );
    return doc;
  }

  /**
   * The API route for getting a doc.
   * Organization members, moderators, and owners should be allowed to access the endpoint.
   *
   * @param doc The doc we're looking for.
   *
   * @returns The doc associated with the slug, if one exists.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${Keyword.Doc}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(@Doc() doc: DocEntity): Promise<DocEntity> {
    this.logger.log(`Get doc request received for slug: ${doc.slug}}`);
    this.logger.log(`Found doc, slug: ${doc.slug}, ID: ${doc.id}`);
    return doc;
  }

  /**
   * The API route for updating a doc.
   * Organization moderators and owners; team members, moderators and owners; and post maintainers should be allowed to access the endpoint.
   * Organization members should be allowed to access the endpoint if the doc is not associated with a team.
   *
   * @param updateDocDto The new values for the doc.
   * @param doc The doc we're looking for.
   *
   * @returns The updated doc, if it was updated successfully.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${Keyword.Doc}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Member,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer,
    ConditionalRoleEnum.OrgMemberIfNoTeamInDoc
  )
  async update(
    @Body() updateDocDto: UpdateDocDto,
    @Doc() doc: DocEntity
  ): Promise<DocEntity> {
    this.logger.log(`Update doc request received for slug: ${doc.slug}`);
    const updatedDoc = await this.docService.update(doc, updateDocDto);
    this.logger.log(
      `Updated doc, slug: ${updatedDoc.slug}, ID: ${updatedDoc.id}`
    );
    return updatedDoc;
  }

  /**
   * The API route for marking a doc as up-to-date.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param doc The doc we're looking for.
   *
   * @returns The updated doc, if it was updated successfully.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post(`:${Keyword.Doc}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async markUpToDate(@Doc() doc: DocEntity): Promise<DocEntity> {
    this.logger.log(`Mark up-to-date request received for slug: ${doc.slug}`);
    const updatedDoc = await this.docService.markUpToDate(doc);
    this.logger.log(
      `Marked doc up-to-date, slug: ${updatedDoc.slug}, ID: ${updatedDoc.id}`
    );
    return updatedDoc;
  }

  /**
   * The API route for deleting a doc.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param doc The doc we're looking for.
   *
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${Keyword.Doc}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async delete(@Doc() doc: DocEntity): Promise<void> {
    this.logger.log(`Delete doc request received for doc slug: ${doc.slug}`);
    await this.docService.delete(doc);
    this.logger.log(`Deleted doc, slug: ${doc.slug}, ID: ${doc.id}`);
  }
}
