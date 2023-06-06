import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  QueryDto,
  SearchService,
  SuggestDto,
} from '@newbee/api/search/data-access';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import { Organization, Role } from '@newbee/api/shared/util';
import {
  BaseQueryResultDto,
  BaseSuggestResultDto,
  searchVersion,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import { OrgRoleEnum } from '@newbee/shared/util';

@Controller({
  path: `${UrlEndpoint.Organization}/:${UrlEndpoint.Organization}/${UrlEndpoint.Search}`,
  version: searchVersion,
})
export class SearchController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  /**
   * The API route for searching an organization.
   * Org members should be allowed to access the endpoint.
   *
   * @param queryDto The query information.
   * @param organization The organization to search in.
   *
   * @returns The results of the search.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post()
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async search(
    @Body() queryDto: QueryDto,
    @Organization() organization: OrganizationEntity
  ): Promise<BaseQueryResultDto> {
    this.logger.log(
      `Search request received for organization ID ${
        organization.id
      }: ${JSON.stringify(queryDto)}`
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
   * @param organization The organization to look in.
   *
   * @returns The suggestions.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(UrlEndpoint.Suggest)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async suggest(
    @Body() suggestDto: SuggestDto,
    @Organization() organization: OrganizationEntity
  ): Promise<BaseSuggestResultDto> {
    this.logger.log(
      `Suggest request received for organization ID ${
        organization.id
      }: ${JSON.stringify(suggestDto)}`
    );

    const result = await this.searchService.suggest(organization, suggestDto);
    this.logger.log(`Result generated: ${JSON.stringify(result)}`);

    return result;
  }
}
