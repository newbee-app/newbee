import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import type {
  DocSolrDoc,
  OrgMemberSolrDoc,
  QnaSolrDoc,
  SolrDoc,
  SolrHighlightedFields,
  TeamSolrDoc,
} from '@newbee/api/shared/util';
import {
  BaseQueryResultDto,
  BaseSuggestResultDto,
} from '@newbee/shared/data-access';
import {
  DocQueryResult,
  internalServerError,
  OrgMemberQueryResult,
  QnaQueryResult,
  SolrEntryEnum,
  surroundSubstringsWith,
  TeamQueryResult,
} from '@newbee/shared/util';
import { QueryResponse, SolrCli, Spellcheck } from '@newbee/solr-cli';
import { QueryDto, SuggestDto } from './dto';

@Injectable()
export class SearchService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(SearchService.name);

  /**
   * The left portion of what to surround query matches with.
   */
  private readonly leftSurround = '<strong>';

  /**
   * The right portion of what to surround query matches with.
   */
  private readonly rightSurround = '</strong>';

  constructor(private readonly solrCli: SolrCli) {}

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
    suggestDto: SuggestDto
  ): Promise<BaseSuggestResultDto> {
    let { query } = suggestDto;
    try {
      // Execute the query
      let solrRes = await this.solrCli.suggest(organization.id, { query });

      // No responses found, execute again with the spellchecked alternative
      if (!solrRes.response.numFound) {
        const suggestion = solrRes.spellcheck
          ? SearchService.getSpellcheckSuggestion(solrRes.spellcheck)
          : null;
        if (!suggestion) {
          return { suggestions: [] };
        }

        query = suggestion;
        solrRes = await this.solrCli.suggest(organization.id, { query });
      }

      // Tokenize the query and turn the token into regexes
      const queries = Array.from(new Set(query.toLowerCase().split(/\s+/)));
      const queryRegexes = queries.map((query) => new RegExp(query, 'i'));

      // Go through all of the result docs and generate suggestions based on the parts of the doc that matched
      const docs = solrRes.response.docs as SolrDoc[];
      const suggestions = docs
        .map((doc) => {
          const {
            user_name,
            user_display_name,
            user_email,
            user_phone_number,
            team_name,
            title,
          } = doc;

          for (const field of [
            user_name,
            user_display_name,
            user_email,
            user_phone_number,
            team_name,
            title,
          ]) {
            if (queryRegexes.some((regex) => regex.test(field ?? ''))) {
              return surroundSubstringsWith(
                field ?? '',
                queries,
                this.leftSurround,
                this.rightSurround
              );
            }
          }

          return '';
        })
        .filter(Boolean);

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
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr Cli or services throw an error.
   */
  async query(
    organization: OrganizationEntity,
    queryDto: QueryDto
  ): Promise<BaseQueryResultDto> {
    const { query, offset } = queryDto;
    const result = new BaseQueryResultDto(offset);

    // this should never happen, but leave it for safety
    if (!query) {
      return result;
    }

    // Execute the query
    const solrRes = await this.makeQuery(organization, queryDto);

    // Record how many results were found
    const numFound = solrRes.response.numFound;
    result.total = numFound;

    // No results found, suggest an alternative spelling
    if (!numFound) {
      const suggestion = solrRes.spellcheck
        ? SearchService.getSpellcheckSuggestion(solrRes.spellcheck)
        : null;
      if (suggestion) {
        result.suggestion = suggestion;
      }
      return result;
    }

    // Look for the type of docs that necessitate additional queries and gather the additional IDs we need to query for
    const docs = solrRes.response.docs as SolrDoc[];
    const queryIds = Array.from(
      new Set(
        docs
          .filter((doc) =>
            [SolrEntryEnum.Doc, SolrEntryEnum.Qna].includes(doc.entry_type)
          )
          .flatMap(
            (doc) =>
              [doc.team, doc.creator, doc.maintainer].filter(
                Boolean
              ) as string[]
          )
      )
    );

    // Execute the additional query
    const idsRes = queryIds.length
      ? await this.solrCli.realTimeGetByIds(organization.id, queryIds)
      : null;
    const idsResDocs = idsRes ? (idsRes.response.docs as SolrDoc[]) : [];

    // Take the org members resulting from the additional query and map them from their IDs to the information we care about
    const orgMemberMap = new Map(
      idsResDocs
        .filter((doc) => doc.entry_type === SolrEntryEnum.User)
        .map((doc) => [
          doc.id,
          SearchService.handleOrgMember(doc as OrgMemberSolrDoc),
        ])
    );

    // Take the teams resulting from the additional query and map them from their IDs to the information we care about
    const teamMap = new Map(
      idsResDocs
        .filter((doc) => doc.entry_type === SolrEntryEnum.Team)
        .map((doc) => [doc.id, SearchService.handleTeam(doc as TeamSolrDoc)])
    );

    // Construct a map from the highlighting portion of the original response
    const highlightMap = new Map<string, SolrHighlightedFields>(
      Object.entries(solrRes.highlighting ?? {}).filter(
        ([, highlightedFields]) => Object.keys(highlightedFields).length
      )
    );

    // Iterate through the responses to construct the result
    docs.forEach((doc) => {
      const { id, entry_type: entryType } = doc;
      const highlightedFields = highlightMap.get(id) ?? {};
      switch (entryType) {
        case SolrEntryEnum.User: {
          result.results.push(
            SearchService.handleOrgMember(doc as OrgMemberSolrDoc)
          );
          break;
        }
        case SolrEntryEnum.Team: {
          result.results.push(SearchService.handleTeam(doc as TeamSolrDoc));
          break;
        }
        case SolrEntryEnum.Doc: {
          result.results.push(
            SearchService.handleDoc(
              doc as DocSolrDoc,
              orgMemberMap,
              teamMap,
              highlightedFields
            )
          );
          break;
        }
        case SolrEntryEnum.Qna: {
          result.results.push(
            SearchService.handleQna(
              doc as QnaSolrDoc,
              orgMemberMap,
              teamMap,
              highlightedFields
            )
          );
          break;
        }
      }
    });

    return result;
  }

  /**
   * A helper function for making a Solr query.
   *
   * @param organization The organization to query.
   * @param queryDto The parameters for the query itself.
   *
   * @returns The query response from Solr.
   * @throws {InternalServerErrorException} `internalServerError`. If the Solr CLI throws an error.
   */
  private async makeQuery(
    organization: OrganizationEntity,
    queryDto: QueryDto
  ): Promise<QueryResponse> {
    const { query, offset, type } = queryDto;
    try {
      return await this.solrCli.query(organization.id, {
        query,
        offset,
        ...(type && { filter: `entry_type:${type}` }),
        params: {
          'hl.q': query,
          'spellcheck.q': query,
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
    spellcheck: Spellcheck
  ): string | null {
    const spellcheckSuggestion = spellcheck.collations[1] ?? null;
    return spellcheckSuggestion ? spellcheckSuggestion.collationQuery : null;
  }

  /**
   * A helper function that takes in an org member doc response and converts it to an `OrgMemberQueryResult`.
   *
   * @param doc The doc response to convert.
   *
   * @returns The `OrgMemberQueryResult` resulting from the doc.
   */
  private static handleOrgMember(doc: OrgMemberSolrDoc): OrgMemberQueryResult {
    const {
      slug,
      org_role,
      user_email,
      user_name,
      user_display_name,
      user_phone_number,
    } = doc;
    return {
      orgMember: { slug, role: org_role },
      user: {
        email: user_email,
        name: user_name,
        displayName: user_display_name ?? null,
        phoneNumber: user_phone_number ?? null,
      },
    };
  }

  /**
   * A helper function that takes in a team doc response and converts it to a `TeamQueryResult`.
   *
   * @param doc The doc response to convert.
   *
   * @returns The `TeamQueryResult` resulting from the doc.
   */
  private static handleTeam(doc: TeamSolrDoc): TeamQueryResult {
    const { slug, team_name } = doc;
    return { slug, name: team_name };
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
  private static handleDoc(
    doc: DocSolrDoc,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightedFields: SolrHighlightedFields = {}
  ): DocQueryResult {
    const {
      created_at,
      updated_at,
      marked_up_to_date_at,
      up_to_date,
      title,
      slug,
      team,
      creator,
      maintainer,
      doc_txt,
    } = doc;
    return {
      doc: {
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
        markedUpToDateAt: new Date(marked_up_to_date_at),
        upToDate: up_to_date,
        title,
        slug,
        docSnippet: highlightedFields.doc_txt?.[0] ?? doc_txt.slice(0, 100),
      },
      creator: orgMemberMap.get(creator ?? '') ?? null,
      maintainer: orgMemberMap.get(maintainer ?? '') ?? null,
      team: teamMap.get(team ?? '') ?? null,
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
  private static handleQna(
    doc: QnaSolrDoc,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightedFields: SolrHighlightedFields = {}
  ): QnaQueryResult {
    const {
      created_at,
      updated_at,
      marked_up_to_date_at,
      up_to_date,
      title,
      slug,
      team,
      creator,
      maintainer,
      question_txt,
      answer_txt,
    } = doc;
    return {
      qna: {
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
        markedUpToDateAt: new Date(marked_up_to_date_at),
        upToDate: up_to_date,
        title,
        slug,
        questionSnippet:
          highlightedFields.question_txt?.[0] ??
          question_txt?.slice(0, 100) ??
          null,
        answerSnippet:
          highlightedFields.answer_txt?.[0] ??
          answer_txt?.slice(0, 100) ??
          null,
      },
      team: teamMap.get(team ?? '') ?? null,
      creator: orgMemberMap.get(creator ?? '') ?? null,
      maintainer: orgMemberMap.get(maintainer ?? '') ?? null,
    };
  }
}
