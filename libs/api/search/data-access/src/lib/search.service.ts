import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import {
  DocSolrDoc,
  OrgMemberSolrDoc,
  QnaSolrDoc,
  SolrDoc,
  TeamSolrDoc,
  solrDefaultHighlightedFields,
  solrDictionaries,
  solrFields,
} from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  BaseQueryResultsDto,
  BaseSuggestResultsDto,
  DocQueryResult,
  OrgMemberQueryResult,
  QnaQueryResult,
  SolrEntryEnum,
  TeamQueryResult,
  internalServerError,
} from '@newbee/shared/util';
import {
  DocResponse,
  HighlightedFields,
  QueryResponse,
  SolrCli,
  Spellcheck,
} from '@newbee/solr-cli';
import { QueryDto, SuggestDto } from './dto';

@Injectable()
export class SearchService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly solrCli: SolrCli,
    private readonly teamService: TeamService,
    private readonly orgMemberService: OrgMemberService,
  ) {}

  /**
   * Handles a suggest request for all cases.
   *
   * @param organization The organization to look in.
   * @param suggestDto The parameters for the suggest query.
   *
   * @returns The suggestions based on the query.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr Cli throws an error.
   */
  async suggest(
    organization: OrganizationEntity,
    suggestDto: SuggestDto,
  ): Promise<BaseSuggestResultsDto> {
    const { query, type } = suggestDto;
    const dictionary = type ?? solrDictionaries.all;
    try {
      // Execute the query
      const solrRes = await this.solrCli.suggest(organization.id, {
        params: { 'suggest.q': query, 'suggest.dictionary': dictionary },
      });

      // Go through all of the result docs and generate suggestions based on the parts of the doc that matched

      const suggestionObjects =
        solrRes.suggest?.[dictionary]?.[query]?.suggestions ?? [];
      const suggestions = suggestionObjects.map(
        (suggestion) => suggestion.term,
      );

      return { suggestions };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Handle a query request for all cases.
   *
   * @param organization The organization to look in.
   * @param queryDto The parameters for the query itself.
   *
   * @returns The matches that fulfill the query.
   * @throws {NotFoundException} `teamSlugNotFound`, `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr Cli or services throw an error.
   */
  async query(
    organization: OrganizationEntity,
    queryDto: QueryDto,
  ): Promise<BaseQueryResultsDto> {
    const { query } = queryDto;
    const results = new BaseQueryResultsDto();
    Object.assign(results, queryDto);

    // This should never happen, but leave it for safety
    if (!query) {
      return results;
    }

    // Execute the query
    const solrRes = await this.makeQuery(organization, queryDto);

    // This shouldn't happen, but needed for type safety
    const { response } = solrRes;
    if (!response) {
      return results;
    }

    // Record how many results were found
    const numFound = response.numFound;
    results.total = numFound;

    // No results found, suggest an alternative spelling
    if (!numFound) {
      const suggestion = solrRes.spellcheck
        ? SearchService.getSpellcheckSuggestion(solrRes.spellcheck)
        : null;
      if (suggestion) {
        results.suggestion = suggestion;
      }
      return results;
    }

    // Look for the type of docs that necessitate additional queries and gather the additional IDs we need to query for
    const docs = response.docs.map((doc) =>
      SearchService.docResponseToSolrDoc(doc),
    );
    const queryIds = Array.from(
      new Set(
        docs
          .filter((doc) =>
            [SolrEntryEnum.Doc, SolrEntryEnum.Qna].includes(doc.entry_type),
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
    const idsResDocs: SolrDoc[] = [];
    if (idsRes) {
      if (idsRes.doc) {
        idsResDocs.push(SearchService.docResponseToSolrDoc(idsRes.doc));
      } else if (idsRes.response) {
        idsResDocs.push(
          ...idsRes.response.docs.map((doc) =>
            SearchService.docResponseToSolrDoc(doc),
          ),
        );
      }
    }

    // Take the org members resulting from the additional query and map them from their IDs to the information we care about
    const orgMemberMap = new Map(
      idsResDocs
        .filter((doc) => doc.entry_type === SolrEntryEnum.User)
        .map((doc) => [
          doc.id,
          SearchService.orgMemberSolrDocToOrgMemberQueryResult(
            doc as OrgMemberSolrDoc,
          ),
        ]),
    );

    // Take the teams resulting from the additional query and map them from their IDs to the information we care about
    const teamMap = new Map(
      idsResDocs
        .filter((doc) => doc.entry_type === SolrEntryEnum.Team)
        .map((doc) => [
          doc.id,
          SearchService.teamSolrDocToTeamQueryResult(doc as TeamSolrDoc),
        ]),
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
        case SolrEntryEnum.User: {
          results.results.push(
            SearchService.orgMemberSolrDocToOrgMemberQueryResult(
              doc as OrgMemberSolrDoc,
            ),
          );
          break;
        }
        case SolrEntryEnum.Team: {
          results.results.push(
            SearchService.teamSolrDocToTeamQueryResult(doc as TeamSolrDoc),
          );
          break;
        }
        case SolrEntryEnum.Doc: {
          results.results.push(
            SearchService.docSolrDocToDocQueryResult(
              doc as DocSolrDoc,
              orgMemberMap,
              teamMap,
              highlightedFields,
            ),
          );
          break;
        }
        case SolrEntryEnum.Qna: {
          results.results.push(
            SearchService.qnaSolrDocToQnaQueryResult(
              doc as QnaSolrDoc,
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
   * A helper function for making a Solr query.
   *
   * @param organization The organization to query.
   * @param queryDto The parameters for the query itself.
   *
   * @returns The query response from Solr.
   * @throws {NotFoundException} `teamSlugNotFound`, `orgMemberNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr CLI throws an error.
   */
  private async makeQuery(
    organization: OrganizationEntity,
    queryDto: QueryDto,
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
    } = queryDto;

    const dictionary = type ?? solrDictionaries.all;
    const team = teamSlug
      ? await this.teamService.findOneBySlug(organization, teamSlug)
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
      ...(type ? [`${solrFields.entry_type}:${type}`] : []),
      ...(team ? [`${solrFields.team_id}:${team.id}`] : []),
      ...(orgMember
        ? [
            `${solrFields.creator_id}:${orgMember.id} OR ${solrFields.maintainer_id}:${orgMember.id}`,
          ]
        : []),
      ...(creator ? [`${solrFields.creator_id}:${creator.id}`] : []),
      ...(maintainer ? [`${solrFields.maintainer_id}:${maintainer.id}`] : []),
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
   * A helper function that takes in a spellcheck object and spits out its suggested collation query.
   *
   * @param spellcheck The spellcheck object to examine.
   *
   * @returns The suggestion as a string if it exists, null otherwise.
   */
  private static getSpellcheckSuggestion(
    spellcheck: Spellcheck,
  ): string | null {
    const spellcheckSuggestion = spellcheck.collations[1] ?? null;
    return spellcheckSuggestion?.collationQuery ?? null;
  }

  /**
   * Converts a `DocResponse` to the relevant subtype of `SolrDoc`, depending on its type.
   *
   * @param doc The `DocResponse` to convert.
   *
   * @returns The corresponding `SolrDoc`.
   */
  private static docResponseToSolrDoc(doc: DocResponse): SolrDoc {
    const type = doc[solrFields.entry_type] as SolrEntryEnum;
    switch (type) {
      case SolrEntryEnum.Doc:
        return new DocSolrDoc(doc);
      case SolrEntryEnum.Qna:
        return new QnaSolrDoc(doc);
      case SolrEntryEnum.Team:
        return new TeamSolrDoc(doc);
      case SolrEntryEnum.User:
        return new OrgMemberSolrDoc(doc);
    }
  }

  /**
   * A helper function that takes in a doc doc response and converts it to a `DocQueryResult`.
   *
   * @param doc The doc response to convert.
   * @param orgMemberMap A map mapping an org member's ID to the org member.
   * @param teamMap A map mapping a team's ID to the team.
   * @param highlightedFields The highlighted fields for the doc. Leave blank to default to the doc's values without highlights.
   *
   * @returns The `DocQueryResult` resulting from the doc.
   */
  private static docSolrDocToDocQueryResult(
    doc: DocSolrDoc,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightedFields: HighlightedFields = {},
  ): DocQueryResult {
    const {
      created_at,
      updated_at,
      marked_up_to_date_at,
      out_of_date_at,
      slug,
      team_id,
      creator_id,
      maintainer_id,
      doc_title,
      doc_txt,
    } = doc;
    return {
      doc: {
        createdAt: created_at,
        updatedAt: updated_at,
        markedUpToDateAt: marked_up_to_date_at,
        outOfDateAt: out_of_date_at,
        title: doc_title,
        slug,
        docSnippet:
          highlightedFields[solrDefaultHighlightedFields.doc_txt]?.[0] ??
          doc_txt.slice(0, 100),
      },
      creator: orgMemberMap.get(creator_id ?? '') ?? null,
      maintainer: orgMemberMap.get(maintainer_id ?? '') ?? null,
      team: teamMap.get(team_id ?? '') ?? null,
    };
  }

  /**
   * A helper function that takes in a doc response and converts it to a `QnaQueryResult`.
   * Does not check if the doc is of the right type, that responsibility falls on the caller.
   *
   * @param doc The doc response to convert.
   * @param orgMemberMap A map mapping an org member's ID to the org member.
   * @param teamMap A map mapping a team's ID to the team.
   * @param highlightMap A map mapping a doc's ID to its highlighted fields.
   * @param highlightedFields The highlighted fields for the doc. Leave blank to default to the doc's values without highlights.
   *
   * @returns The `QnaQueryResult` resulting from the doc.
   */
  private static qnaSolrDocToQnaQueryResult(
    doc: QnaSolrDoc,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightedFields: HighlightedFields = {},
  ): QnaQueryResult {
    const {
      created_at,
      updated_at,
      marked_up_to_date_at,
      out_of_date_at,
      slug,
      team_id,
      creator_id,
      maintainer_id,
      qna_title,
      question_txt,
      answer_txt,
    } = doc;
    return {
      qna: {
        createdAt: created_at,
        updatedAt: updated_at,
        markedUpToDateAt: marked_up_to_date_at,
        outOfDateAt: out_of_date_at,
        title: qna_title,
        slug,
        questionSnippet:
          highlightedFields[solrDefaultHighlightedFields.question_txt]?.[0] ??
          question_txt?.slice(0, 100) ??
          null,
        answerSnippet:
          highlightedFields[solrDefaultHighlightedFields.answer_txt]?.[0] ??
          answer_txt?.slice(0, 100) ??
          null,
      },
      team: teamMap.get(team_id ?? '') ?? null,
      creator: orgMemberMap.get(creator_id ?? '') ?? null,
      maintainer: orgMemberMap.get(maintainer_id ?? '') ?? null,
    };
  }

  /**
   * A helper function that takes in a team doc response and converts it to a `TeamQueryResult`.
   *
   * @param doc The doc response to convert.
   *
   * @returns The `TeamQueryResult` resulting from the doc.
   */
  private static teamSolrDocToTeamQueryResult(
    doc: TeamSolrDoc,
  ): TeamQueryResult {
    const { slug, created_at, updated_at, team_name } = doc;
    return {
      slug,
      createdAt: created_at,
      updatedAt: updated_at,
      name: team_name,
    };
  }

  /**
   * A helper function that takes in an org member doc response and converts it to an `OrgMemberQueryResult`.
   *
   * @param doc The doc response to convert.
   *
   * @returns The `OrgMemberQueryResult` resulting from the doc.
   */
  private static orgMemberSolrDocToOrgMemberQueryResult(
    doc: OrgMemberSolrDoc,
  ): OrgMemberQueryResult {
    const {
      slug,
      created_at,
      updated_at,
      user_email,
      user_name,
      user_display_name,
      user_phone_number,
      user_org_role,
    } = doc;
    return {
      orgMember: {
        slug,
        createdAt: created_at,
        updatedAt: updated_at,
        role: user_org_role,
      },
      user: {
        email: user_email,
        name: user_name,
        displayName: user_display_name ?? null,
        phoneNumber: user_phone_number ?? null,
      },
    };
  }
}
