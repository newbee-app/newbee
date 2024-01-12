import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  QueryDto,
  SearchService,
  SuggestDto,
} from '@newbee/api/search/data-access';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import { Organization, Role } from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseSuggestResultsDto,
  Keyword,
  QueryResults,
  apiRoles,
} from '@newbee/shared/util';

@Controller({
  path: `${Keyword.Organization}/:${Keyword.Organization}/${Keyword.Search}`,
  version: apiVersion.search,
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
  @Get()
  @Role(apiRoles.search.search)
  async search(
    @Query() queryDto: QueryDto,
    @Organization() organization: OrganizationEntity,
  ): Promise<QueryResults> {
    this.logger.log(
      `Search request received for organization ID ${
        organization.id
      }: ${JSON.stringify(queryDto)}`,
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
  @Get(Keyword.Suggest)
  @Role(apiRoles.search.suggest)
  async suggest(
    @Query() suggestDto: SuggestDto,
    @Organization() organization: OrganizationEntity,
  ): Promise<BaseSuggestResultsDto> {
    this.logger.log(
      `Suggest request received for organization ID ${
        organization.id
      }: ${JSON.stringify(suggestDto)}`,
    );

    const result = await this.searchService.suggest(organization, suggestDto);
    this.logger.log(`Result generated: ${JSON.stringify(result)}`);

    return result;
  }
}
