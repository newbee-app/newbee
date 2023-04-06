import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import type { SolrDoc, SolrHighlightedFields } from '@newbee/api/shared/util';
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
import { SolrCli, Spellcheck } from '@newbee/solr-cli';
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
  private readonly leftSurround = '<b>';

  /**
   * The right portion of what to surround query matches with.
   */
  private readonly rightSurround = '</b>';

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
            user_display_name,
            user_name,
            team_name,
            doc_title,
            qna_title,
          } = doc;

          for (const field of [
            user_display_name,
            user_name,
            team_name,
            doc_title,
            qna_title,
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
    const { query, offset, type } = queryDto;
    const result: BaseQueryResultDto = { offset };
    if (!query) {
      return result;
    }

    try {
      // Execute the query
      const solrRes = await this.solrCli.query(organization.id, {
        query,
        offset,
        ...(type && { filter: `entry_type:${type}` }),
        params: {
          'hl.q': query,
          'spellcheck.q': query,
        },
      });

      // No responses found, suggest an alternative spelling
      if (!solrRes.response.numFound) {
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
            .filter(
              (doc) =>
                doc.entry_type === SolrEntryEnum.Doc ||
                doc.entry_type === SolrEntryEnum.Qna
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
          .map((doc) => [doc.id, SearchService.handleOrgMember(doc)])
      );

      // Take the teams resulting from the additional query and map them from their IDs to the information we care about
      const teamMap = new Map(
        idsResDocs
          .filter((doc) => doc.entry_type === SolrEntryEnum.Team)
          .map((doc) => [doc.id, SearchService.handleTeam(doc)])
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
            result.orgMember = result.orgMember ?? [];
            result.orgMember.push(SearchService.handleOrgMember(doc));
            break;
          }
          case SolrEntryEnum.Team: {
            result.team = result.team ?? [];
            result.team.push(SearchService.handleTeam(doc));
            break;
          }
          case SolrEntryEnum.Doc: {
            result.doc = result.doc ?? [];
            result.doc.push(
              SearchService.handleDoc(
                doc,
                orgMemberMap,
                teamMap,
                highlightedFields
              )
            );
            break;
          }
          case SolrEntryEnum.Qna: {
            result.qna = result.qna ?? [];
            result.qna.push(
              SearchService.handleQna(
                doc,
                orgMemberMap,
                teamMap,
                highlightedFields
              )
            );
            break;
          }
        }
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    return result;
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
   * A helper function that takes in a doc response and converts it to an `OrgMemberQueryResult`.
   * Does not check if the doc is of the right type, that responsibility falls on the caller.
   *
   * @param doc The doc response to convert.
   *
   * @returns The `OrgMemberQueryResult` resulting from the doc.
   */
  private static handleOrgMember(doc: SolrDoc): OrgMemberQueryResult {
    const { slug, user_name, user_display_name } = doc;
    return {
      slug,
      name: user_name ?? '',
      displayName: user_display_name ?? null,
    };
  }

  /**
   * A helper function that takes in a doc response and converts it to a `TeamQueryResult`.
   * Does not check if the doc is of the right type, that responsibility falls on the caller.
   *
   * @param doc The doc response to convert.
   *
   * @returns The `TeamQueryResult` resulting from the doc.
   */
  private static handleTeam(doc: SolrDoc): TeamQueryResult {
    const { slug, team_name } = doc;

    return { slug, name: team_name ?? '' };
  }

  /**
   * A helper function that takes in a doc response and converts it to a `DocQueryResult`.
   * Does not check if the doc is of the right type, that responsibility falls on the caller.
   *
   * @param doc The doc response to convert.
   * @param orgMemberMap A map mapping an org member's ID to the org member.
   * @param teamMap A map mapping a team's ID to the team.
   * @param highlightedFields The highlighted fields for the doc. Leave blank to default to the doc's values without highlights.
   *
   * @returns The `DocQueryResult` resulting from the doc.
   */
  private static handleDoc(
    doc: SolrDoc,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightedFields: SolrHighlightedFields = {}
  ): DocQueryResult {
    const {
      marked_up_to_date_at,
      up_to_date,
      doc_title,
      slug,
      team,
      creator,
      maintainer,
      doc_txt,
    } = doc;
    return {
      markedUpToDateAt: new Date(marked_up_to_date_at ?? ''),
      upToDate: up_to_date ?? false,
      title: doc_title ?? '',
      slug: slug ?? '',
      team: teamMap.get(team ?? '') ?? null,
      creator: orgMemberMap.get(creator ?? '') as OrgMemberQueryResult,
      maintainer: orgMemberMap.get(maintainer ?? '') ?? null,
      docSnippet: highlightedFields.doc_txt?.[0] ?? doc_txt ?? '',
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
    doc: SolrDoc,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightedFields: SolrHighlightedFields = {}
  ): QnaQueryResult {
    const {
      marked_up_to_date_at,
      up_to_date,
      qna_title,
      slug,
      team,
      creator,
      maintainer,
      question_txt,
      answer_txt,
    } = doc;
    return {
      markedUpToDateAt: new Date(marked_up_to_date_at ?? ''),
      upToDate: up_to_date ?? false,
      title: qna_title ?? '',
      slug: slug ?? '',
      team: teamMap.get(team ?? '') ?? null,
      creator: orgMemberMap.get(creator ?? '') as OrgMemberQueryResult,
      maintainer: orgMemberMap.get(maintainer ?? '') ?? null,
      questionSnippet:
        highlightedFields.question_txt?.[0] ?? question_txt ?? '',
      answerSnippet: highlightedFields.answer_txt?.[0] ?? answer_txt ?? '',
    };
  }
}
