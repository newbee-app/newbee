import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import {
  DocSolrOrgDoc,
  OrgMemberSolrOrgDoc,
  QnaSolrOrgDoc,
  SolrAppDoc,
  SolrOrgDoc,
  TeamSolrOrgDoc,
  UserSolrAppDoc,
  WaitlistSolrAppDoc,
  solrAppCollection,
  solrAppDictionaries,
  solrAppFields,
  solrOrgDictionaries,
  solrOrgFields,
} from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  AppSearchDto,
  AppSearchResultsDto,
  AppSuggestDto,
  CommonSearchResultsDto,
  OrgSearchDto,
  OrgSearchResultsDto,
  OrgSuggestDto,
  SolrAppEntryEnum,
  SolrOrgEntryEnum,
  SuggestResultsDto,
  internalServerError,
} from '@newbee/shared/util';
import {
  DocResponse,
  HighlightedFields,
  QueryResponse,
  SolrCli,
} from '@newbee/solr-cli';

/**
 * The service that interacts with the Solr client to execute search and suggest requests.
 */
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly solrCli: SolrCli,
    private readonly teamService: TeamService,
    private readonly orgMemberService: OrgMemberService,
  ) {}

  /**
   * Handles an org suggest request.
   *
   * @param organization The organization to look in.
   * @param orgSuggestDto The parameters for the suggest query.
   *
   * @returns The suggestions based on the query.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr cli throws an error.
   */
  async orgSuggest(
    organization: OrganizationEntity,
    orgSuggestDto: OrgSuggestDto,
  ): Promise<SuggestResultsDto> {
    const { query, type } = orgSuggestDto;
    const dictionary = type ?? solrOrgDictionaries.All;
    try {
      const solrRes = await this.solrCli.suggest(organization.id, {
        params: { 'suggest.q': query, 'suggest.dictionary': dictionary },
      });
      return new SuggestResultsDto(
        SearchService.getSuggestions(solrRes, dictionary, query),
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Handles an app suggest request.
   *
   * @param appSuggestDto The parameters for the suggest query.
   *
   * @returns The suggestions based on the query.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr cli throws an error.
   */
  async appSuggest(appSuggestDto: AppSuggestDto): Promise<SuggestResultsDto> {
    const { query, type } = appSuggestDto;
    const dictionary = type ?? solrAppDictionaries.All;
    try {
      const solrRes = await this.solrCli.suggest(solrAppCollection, {
        params: { 'suggest.q': query, 'suggest.dictionary': dictionary },
      });
      return new SuggestResultsDto(
        SearchService.getSuggestions(solrRes, dictionary, query),
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Handle an org search request.
   *
   * @param organization The organization to look in.
   * @param orgSearchDto The parameters for the query itself.
   *
   * @returns The matches that fulfill the query.
   * @throws {NotFoundException} `teamSlugNotFound`, `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr cli or services throw an error.
   */
  async orgSearch(
    organization: OrganizationEntity,
    orgSearchDto: OrgSearchDto,
  ): Promise<OrgSearchResultsDto> {
    const { query } = orgSearchDto;
    const results = new OrgSearchResultsDto();
    Object.assign(results, orgSearchDto);

    // This should never happen, but leave it for safety
    if (!query) {
      return results;
    }

    // Execute the query
    const solrRes = await this.makeOrgQuery(organization, orgSearchDto);

    // Pre-process the response and return early if no results were found
    if (SearchService.handleQueryResponse(solrRes, results)) {
      return results;
    }

    // Look for the type of docs that necessitate additional queries and gather the additional IDs we need to query for
    const docs = SearchService.queryResponseToSolrOrgDocs(solrRes);
    const queryIds = Array.from(
      new Set(
        docs
          .filter((doc) =>
            [SolrOrgEntryEnum.Doc, SolrOrgEntryEnum.Qna].includes(
              doc.entry_type,
            ),
          )
          .flatMap(
            (doc) =>
              [doc.team_id, doc.creator_id, doc.maintainer_id].filter(
                Boolean,
              ) as string[],
          ),
      ),
    );

    // Execute the additional query
    const idsRes = queryIds.length
      ? await this.solrCli.realTimeGetByIds(organization.id, queryIds)
      : null;
    const idsResDocs = idsRes
      ? SearchService.queryResponseToSolrOrgDocs(idsRes)
      : [];

    // Take the org members resulting from the additional query and map them from their IDs to the information we care about
    const orgMemberMap = new Map(
      idsResDocs
        .filter((doc) => doc.entry_type === SolrOrgEntryEnum.User)
        .map((doc) => [doc.id, (doc as OrgMemberSolrOrgDoc).toSearchResult()]),
    );

    // Take the teams resulting from the additional query and map them from their IDs to the information we care about
    const teamMap = new Map(
      idsResDocs
        .filter((doc) => doc.entry_type === SolrOrgEntryEnum.Team)
        .map((doc) => [doc.id, (doc as TeamSolrOrgDoc).toSearchResult()]),
    );

    // Construct a map from the highlighting portion of the original response
    const highlightMap = new Map<string, HighlightedFields>(
      Object.entries(solrRes.highlighting ?? {}),
    );

    // Iterate through the responses to construct the result
    docs.forEach((doc) => {
      const { id, entry_type: entryType } = doc;
      const highlightedFields = highlightMap.get(id) ?? {};
      switch (entryType) {
        case SolrOrgEntryEnum.User: {
          results.results.push((doc as OrgMemberSolrOrgDoc).toSearchResult());
          break;
        }
        case SolrOrgEntryEnum.Team: {
          results.results.push((doc as TeamSolrOrgDoc).toSearchResult());
          break;
        }
        case SolrOrgEntryEnum.Doc: {
          results.results.push(
            (doc as DocSolrOrgDoc).toSearchResult(
              orgMemberMap,
              teamMap,
              highlightedFields,
            ),
          );
          break;
        }
        case SolrOrgEntryEnum.Qna: {
          results.results.push(
            (doc as QnaSolrOrgDoc).toSearchResult(
              orgMemberMap,
              teamMap,
              highlightedFields,
            ),
          );
          break;
        }
      }
    });

    return results;
  }

  /**
   * Handles an app search request.
   *
   * @param appSearchDto The parameters for the query itself.
   *
   * @returns The matches that fulfill the query.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr cli throws an error.
   */
  async appSearch(appSearchDto: AppSearchDto): Promise<AppSearchResultsDto> {
    const { query } = appSearchDto;
    const results = new AppSearchResultsDto();
    Object.assign(results, appSearchDto);

    // This should never happen, but leave it for safety
    if (!query) {
      return results;
    }

    // Execute the query
    const solrRes = await this.makeAppQuery(appSearchDto);

    // Pre-process the response and return early if no results were found
    if (SearchService.handleQueryResponse(solrRes, results)) {
      return results;
    }

    // Get all of the Solr app docs associated with the response
    const docs = SearchService.queryResponseToSolrAppDocs(solrRes);

    // Iterate through the docs to construct the result
    docs.forEach((doc) => {
      const { entry_type: entryType } = doc;
      switch (entryType) {
        case SolrAppEntryEnum.User: {
          results.results.push((doc as UserSolrAppDoc).toSearchResult());
          break;
        }
        case SolrAppEntryEnum.Waitlist: {
          results.results.push((doc as WaitlistSolrAppDoc).toSearchResult());
          break;
        }
      }
    });

    return results;
  }

  /**
   * A helper function for making a Solr org query.
   *
   * @param organization The organization to query.
   * @param orgSearchDto The parameters for the query itself.
   *
   * @returns The query response from Solr.
   * @throws {NotFoundException} `teamSlugNotFound`, `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr CLI throws an error.
   */
  private async makeOrgQuery(
    organization: OrganizationEntity,
    orgSearchDto: OrgSearchDto,
  ): Promise<QueryResponse> {
    const {
      query,
      offset,
      limit,
      type,
      team: teamSlug,
      member: orgMemberSlug,
      creator: creatorSlug,
      maintainer: maintainerSlug,
    } = orgSearchDto;

    const dictionary = type ?? solrOrgDictionaries.All;
    const team = teamSlug
      ? await this.teamService.findOneByOrgAndSlug(organization, teamSlug)
      : null;
    const orgMember = orgMemberSlug
      ? await this.orgMemberService.findOneByOrgAndSlug(
          organization,
          orgMemberSlug,
        )
      : null;
    const creator = creatorSlug
      ? await this.orgMemberService.findOneByOrgAndSlug(
          organization,
          creatorSlug,
        )
      : null;
    const maintainer = maintainerSlug
      ? await this.orgMemberService.findOneByOrgAndSlug(
          organization,
          maintainerSlug,
        )
      : null;
    const filter: string[] = [
      ...(type ? [`${solrOrgFields.entry_type}:${type}`] : []),
      ...(team ? [`${solrOrgFields.team_id}:${team.id}`] : []),
      ...(orgMember
        ? [
            `${solrOrgFields.creator_id}:${orgMember.id} OR ${solrOrgFields.maintainer_id}:${orgMember.id}`,
          ]
        : []),
      ...(creator ? [`${solrOrgFields.creator_id}:${creator.id}`] : []),
      ...(maintainer
        ? [`${solrOrgFields.maintainer_id}:${maintainer.id}`]
        : []),
    ];

    try {
      return await this.solrCli.query(organization.id, {
        query,
        offset,
        limit,
        filter,
        params: {
          'hl.q': query,
          'spellcheck.q': query,
          'spellcheck.dictionary': dictionary,
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * A helper function for making a Solr app query.
   *
   * @param appSearchDto The parameters for the query itself.
   *
   * @returns The query response from Solr.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr CLI throws an error.
   */
  private async makeAppQuery(
    appSearchDto: AppSearchDto,
  ): Promise<QueryResponse> {
    const { query, offset, limit, type } = appSearchDto;

    const dictionary = type ?? solrAppDictionaries.All;
    const filter: string[] = [
      ...(type ? [`${solrOrgFields.entry_type}:${type}`] : []),
    ];

    try {
      return await this.solrCli.query(solrAppCollection, {
        query,
        offset,
        limit,
        filter,
        params: {
          'hl.q': query,
          'spellcheck.q': query,
          'spellcheck.dictionary': dictionary,
        },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * A helper function to do some common processing for a query response.
   *
   * @param queryResponse The query response to process.
   * @param searchResultsDto The search results DTO we will be returning.
   *
   * @returns `true` if the caller should return early, `false` otherwise.
   */
  private static handleQueryResponse(
    queryResponse: QueryResponse,
    searchResultsDto: CommonSearchResultsDto,
  ): boolean {
    // This shouldn't happen, but needed for type safety
    const { response } = queryResponse;
    if (!response) {
      return true;
    }

    // Record how many results were found
    const { numFound } = response;
    searchResultsDto.total = numFound;

    // No results found, suggest an alternative spelling
    if (!numFound) {
      const suggestion = SearchService.getSpellcheck(queryResponse);
      if (suggestion) {
        searchResultsDto.suggestion = suggestion;
      }
      return true;
    }

    // Pre-processing done, tell the caller to continue
    return false;
  }

  /**
   * A helper function that takes in a query response and returns its suggestions.
   *
   * @param queryResponse The query response to examine.
   * @param dictionary The dictionary that was queried.
   * @param query The query itself.
   *
   * @returns The suggestions attached to the query.
   */
  private static getSuggestions(
    queryResponse: QueryResponse,
    dictionary: string,
    query: string,
  ): string[] {
    console.log(queryResponse, dictionary, query);
    const suggestionObjects =
      queryResponse.suggest?.[dictionary]?.[query]?.suggestions ?? [];
    console.log(suggestionObjects);
    return suggestionObjects.map((suggestion) => suggestion.term);
  }

  /**
   * A helper function that takes in a query response and spits out its spellcheck suggestion.
   *
   * @param queryResponse The query response to examine.
   *
   * @returns The spellcheck suggestion as a string if it exists, null otherwise.
   */
  private static getSpellcheck(queryResponse: QueryResponse): string | null {
    const spellcheckSuggestion =
      queryResponse.spellcheck?.collations[1] ?? null;
    return spellcheckSuggestion?.collationQuery ?? null;
  }

  /**
   * A helper function that converts a query response to the relevant subtypes of Solr org docs, depending on its type.
   *
   * @param queryResponse The query response to convert.
   *
   * @returns The corresponding Solr org docs.
   */
  private static queryResponseToSolrOrgDocs(
    queryResponse: QueryResponse,
  ): SolrOrgDoc[] {
    return SearchService.getDocResponses(queryResponse).map((doc) => {
      const type = doc[solrOrgFields.entry_type] as SolrOrgEntryEnum;
      switch (type) {
        case SolrOrgEntryEnum.Doc:
          return new DocSolrOrgDoc(doc);
        case SolrOrgEntryEnum.Qna:
          return new QnaSolrOrgDoc(doc);
        case SolrOrgEntryEnum.Team:
          return new TeamSolrOrgDoc(doc);
        case SolrOrgEntryEnum.User:
          return new OrgMemberSolrOrgDoc(doc);
      }
    });
  }

  /**
   * A helper function that converts a query response to the relevant subtypes of Solr app docs, depending on its type.
   *
   * @param queryResponse The query response to convert.
   *
   * @returns The corresponding Solr app docs.
   */
  private static queryResponseToSolrAppDocs(
    queryResponse: QueryResponse,
  ): SolrAppDoc[] {
    return SearchService.getDocResponses(queryResponse).map((doc) => {
      const type = doc[solrAppFields.entry_type] as SolrAppEntryEnum;
      switch (type) {
        case SolrAppEntryEnum.User:
          return new UserSolrAppDoc(doc);
        case SolrAppEntryEnum.Waitlist:
          return new WaitlistSolrAppDoc(doc);
      }
    });
  }

  /**
   * A helper function to get all of the doc responses from a query response.
   *
   * @param queryResponse The query response to extract doc responses from.
   *
   * @returns The doc responses of the query response, if any exist.
   */
  private static getDocResponses(queryResponse: QueryResponse): DocResponse[] {
    return [
      ...(queryResponse.doc ? [queryResponse.doc] : []),
      ...(queryResponse.response?.docs ?? []),
    ];
  }
}
