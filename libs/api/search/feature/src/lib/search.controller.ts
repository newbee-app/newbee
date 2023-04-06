import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  QueryDto,
  SearchService,
  SuggestDto,
} from '@newbee/api/search/data-access';
import { Role } from '@newbee/api/shared/util';
import {
  BaseQueryResultDto,
  BaseSuggestResultDto,
  organization,
  search,
  searchVersion,
  suggest,
} from '@newbee/shared/data-access';
import { OrgRoleEnum } from '@newbee/shared/util';

@Controller({
  path: `${organization}/:${organization}`,
  version: searchVersion,
})
export class SearchController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(SearchController.name);

  constructor(
    private readonly searchService: SearchService,
    private readonly organizationService: OrganizationService
  ) {}

  /**
   * The API route for searching an organization.
   * Org members should be allowed to access the endpoint.
   *
   * @param queryDto The query information.
   * @param organizationSlug The slug of the organization to search in.
   *
   * @returns The results of the search.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the organization slug cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(search)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async search(
    @Body() queryDto: QueryDto,
    @Param(organization) organizationSlug: string
  ): Promise<BaseQueryResultDto> {
    this.logger.log(
      `Search request received for organization slug ${organizationSlug}: ${JSON.stringify(
        queryDto
      )}`
    );

    const organization = await this.organizationService.findOneBySlug(
      organizationSlug
    );
    const result = await this.searchService.query(organization, queryDto);
    this.logger.log(`Result generated: ${JSON.stringify(result)}`);

    return result;
  }

  /**
   * The API route for making query suggestions.
   * Org members should be allowed to access the endpoint.
   *
   * @param suggestDto The information for generating a suggestion.
   * @param organizationSlug The slug of the organization to look in.
   *
   * @returns The suggestions.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the organization slug cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(suggest)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async suggest(
    @Body() suggestDto: SuggestDto,
    @Param(organization) organizationSlug: string
  ): Promise<BaseSuggestResultDto> {
    this.logger.log(
      `Suggest request received for organization slug ${organizationSlug}: ${JSON.stringify(
        suggestDto
      )}`
    );

    const organization = await this.organizationService.findOneBySlug(
      organizationSlug
    );
    const result = await this.searchService.suggest(organization, suggestDto);
    this.logger.log(`Result generated: ${JSON.stringify(result)}`);

    return result;
  }
}
