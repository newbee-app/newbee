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
  TeamNameDto,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  docSlug,
  organizationName,
  OrgRoleEnum,
  PostRoleEnum,
  Role,
  TeamRoleEnum,
  User,
} from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import { create, doc, docVersion } from '@newbee/shared/data-access';

/**
 * The controller that interacts with `DocEntity`.
 */
@Controller({ path: `:${organizationName}/${doc}`, version: docVersion })
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
   * Organization members, moderators and owners should be allowed to access this endpoint.
   * No need for team permissions as team members should also be organization members.
   *
   * @param createDocDto The information necessary to create a doc.
   * @param user The user that sent the request and will become the owner of the doc.
   * @param organizationName The name of the organization the doc will go in.
   * @param teamName The name of the team the doc will go in, if applicable.
   *
   * @returns The newly created doc.
   * @throws {BadRequestException} `docSlugTakenBadRequest`. If the slug is already taken in the organization.
   * @throws {NotFoundException} `organizationNameNotFound`, `orgMemberNotFound`, `teamNameNotFound`. If the organization name cannot be found, the user does not exist in the organization, or the team does not exist in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(create)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async create(
    @Body() createDocDto: CreateDocDto,
    @User() user: UserEntity,
    @Param(organizationName) organizationName: string,
    @Query() teamNameDto: TeamNameDto
  ): Promise<DocEntity> {
    const { teamName } = teamNameDto;
    this.logger.log(
      `Create doc request received from user ID: ${user.id}, with slug: ${
        createDocDto.slug
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
    const doc = await this.docService.create(createDocDto, team, orgMember);
    this.logger.log(`Doc created with slug: ${doc.slug}, ID: ${doc.id}`);

    return doc;
  }

  /**
   * The API route for getting a doc.
   * Organization members, moderators, and owners should be allowed to access the endpoint.
   *
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   *
   * @returns The doc associated with the slug in the organization, if one exists.
   * @throws {NotFoundException} `organizationNameNotFound`, `docSlugNotFound`. If the organization name cannot be found or if the doc's slug could not be found in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${docSlug}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(
    @Param(organizationName) organizationName: string,
    @Param(docSlug) slug: string
  ): Promise<DocEntity> {
    this.logger.log(
      `Get doc request received for slug: ${slug}, in organization: ${organizationName}`
    );

    const doc = await this.getDoc(organizationName, slug);
    this.logger.log(`Found doc, slug: ${slug}, ID: ${doc.id}`);

    return doc;
  }

  /**
   * The API route for updating a doc.
   * Organization moderators and owners; team moderators and owners; and post maintainers should be allowed to access the endpoint.
   *
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   * @param updateDocDto The new values for the doc.
   *
   * @returns The updated doc, if it was updated successfully.
   * @throws {NotFoundException} `organizationNameNotFound`, `docSlugNotFound`. If the organization can't be found of if the doc's slug can't be found in the organization.
   * @throws {BadRequestException} `docSlugTakenBadRequest`. If the doc's slug is being updated and is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${docSlug}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async update(
    @Param(organizationName) organizationName: string,
    @Param(docSlug) slug: string,
    @Body() updateDocDto: UpdateDocDto
  ): Promise<DocEntity> {
    this.logger.log(
      `Update doc request received for slug: ${slug}, in organization: ${organizationName}, with values: ${JSON.stringify(
        updateDocDto
      )}`
    );

    const doc = await this.getDoc(organizationName, slug);
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
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   */
  @Delete(`:${docSlug}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner,
    PostRoleEnum.Maintainer
  )
  async delete(
    @Param(organizationName) organizationName: string,
    @Param(docSlug) slug: string
  ): Promise<void> {
    this.logger.log(
      `Delete doc request received for doc slug: ${slug}, in organization: ${organizationName}`
    );
    const doc = await this.getDoc(organizationName, slug);
    await this.docService.delete(doc);
    this.logger.log(`Deleted doc, slug: ${slug}, ID: ${doc.id}`);
  }

  /**
   * Finds the doc with the given slug in the organization.
   *
   * @param organizationName The name of the organization to look in.
   * @param slug The slug to look for.
   *
   * @returns The associated doc, if it exists.
   * @throws {NotFoundException} `organizationNameNotFound`, `docSlugNotFound`. If the organization or slug cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  private async getDoc(
    organizationName: string,
    slug: string
  ): Promise<DocEntity> {
    const organization = await this.organizationService.findOneByName(
      organizationName
    );
    return await this.docService.findOneBySlug(organization, slug);
  }
}
