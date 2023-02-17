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
import {
  CreateDocDto,
  DocService,
  UpdateDocDto,
} from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  DocEntity,
  TeamSlugDto,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  ConditionalRoleEnum,
  OrgRoleEnum,
  PostRoleEnum,
  Role,
  TeamRoleEnum,
  User,
} from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  create,
  doc,
  docVersion,
  organization,
} from '@newbee/shared/data-access';

/**
 * The controller that interacts with `DocEntity`.
 */
@Controller({ path: `:${organization}/${doc}`, version: docVersion })
export class DocController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(DocController.name);

  constructor(
    private readonly docService: DocService,
    private readonly organizationService: OrganizationService,
    private readonly orgMemberService: OrgMemberService,
    private readonly teamService: TeamService
  ) {}

  /**
   * The API route for creating a doc.
   * Org moderators and owners; and team members, moderators, and owners should be allowed to access the endpoint.
   * Org members should be allowed to access the endpoint if no team was specified in the request's query or body.
   *
   * @param createDocDto The information necessary to create a doc.
   * @param user The user that sent the request and will become the owner of the doc.
   * @param organizationSlug The slug of the organization the doc will go in.
   * @param teamSlugDto The DTO containing the slug of the team the doc will go in, if applicable.
   *
   * @returns The newly created doc.
   * @throws {NotFoundException} `organizationSlugNotFound`, `orgMemberNotFound`, `teamSlugNotFound`. If the organization slug cannot be found, the user does not exist in the organization, or the team does not exist in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(create)
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
    @User() user: UserEntity,
    @Param(organization) organizationSlug: string,
    @Query() teamSlugDto: TeamSlugDto
  ): Promise<DocEntity> {
    const { team: teamSlug } = teamSlugDto;
    this.logger.log(
      `Create doc request received from user ID: ${
        user.id
      }, in organization: ${organizationSlug}${
        teamSlug ? `, in team: ${teamSlug}` : ''
      }, with title: ${createDocDto.title}`
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
    const doc = await this.docService.create(createDocDto, team, orgMember);
    this.logger.log(
      `Doc created with ID: ${doc.id}, slug: ${doc.slug}, title: ${doc.title}`
    );

    return doc;
  }

  /**
   * The API route for getting a doc.
   * Organization members, moderators, and owners should be allowed to access the endpoint.
   *
   * @param slug The slug to look for.
   *
   * @returns The doc associated with the slug, if one exists.
   * @throws {NotFoundException} `docSlugNotFound`. If the doc's slug could not be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${doc}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(@Param(doc) slug: string): Promise<DocEntity> {
    this.logger.log(`Get doc request received for slug: ${slug}}`);
    const doc = await this.docService.findOneBySlug(slug);
    this.logger.log(`Found doc, slug: ${slug}, ID: ${doc.id}`);
    return doc;
  }

  /**
   * The API route for updating a doc.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param slug The slug to look for.
   * @param updateDocDto The new values for the doc.
   *
   * @returns The updated doc, if it was updated successfully.
   * @throws {NotFoundException} `docSlugNotFound`. If the doc's slug can't be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${doc}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async update(
    @Param(doc) slug: string,
    @Body() updateDocDto: UpdateDocDto
  ): Promise<DocEntity> {
    this.logger.log(`Update doc request received for slug: ${slug}`);

    const doc = await this.docService.findOneBySlug(slug);
    const updatedDoc = await this.docService.update(doc, updateDocDto);
    this.logger.log(
      `Updated doc, slug: ${updatedDoc.slug}, ID: ${updatedDoc.id}`
    );

    return updatedDoc;
  }

  /**
   * The API route for deleting a doc.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param slug The slug to look for.
   *
   * @throws {NotFoundException} `docSlugNotFound`. If the doc's slug can't be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${doc}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async delete(@Param(doc) slug: string): Promise<void> {
    this.logger.log(`Delete doc request received for doc slug: ${slug}`);
    const doc = await this.docService.findOneBySlug(slug);
    await this.docService.delete(doc);
    this.logger.log(`Deleted doc, slug: ${slug}, ID: ${doc.id}`);
  }
}
