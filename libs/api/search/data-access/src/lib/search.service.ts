import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrganizationEntity } from '@newbee/api/shared/data-access';
import {
  BaseQueryResultDto,
  BaseSuggestResultDto,
} from '@newbee/shared/data-access';
import type {
  DocQueryResult,
  OrgMemberQueryResult,
  QnaQueryResult,
  TeamQueryResult,
} from '@newbee/shared/util';
import { internalServerError, SolrEntryEnum } from '@newbee/shared/util';
import type { DocResponse, HighlightedFields } from '@newbee/solr-cli';
import { SolrCli } from '@newbee/solr-cli';
import { QueryDto, SuggestDto } from './dto';

@Injectable()
export class SearchService {
  /**
   * The logger to use when logging anything in the service.
   */
  private readonly logger = new Logger(SearchService.name);

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
    const { type, query } = suggestDto;
    try {
      const solrRes = await this.solrCli.suggest(organization.id, {
        params: {
          'suggest.q': query,
          ...(type && { 'suggest.dictionary': type }),
        },
      });
      return {
        suggestions:
          solrRes.suggest?.[type ?? 'default']?.[query]?.suggestions.map(
            (suggestion) => suggestion.term
          ) ?? [],
      };
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
    if (!query) {
      return {};
    }

    const result: BaseQueryResultDto = {};
    try {
      // Execute the query
      const solrRes = await this.solrCli.query(organization.id, {
        query: {
          edismax: {
            query,
          },
        },
        offset,
        ...(type && { filter: `entry_type:${type}` }),
        params: {
          'hl.q': query,
          'spellcheck.q': query,
          'suggest.q': query,
          ...(type && {
            'spellcheck.dictionary': type,
            'suggest.dictionary': type,
          }),
        },
      });

      // No responses found
      if (!solrRes.response.numFound) {
        // Check spellcheck suggestions first
        const spellcheckSuggestion =
          solrRes.spellcheck?.collations?.[1] ?? null;
        let suggestion = !spellcheckSuggestion
          ? null
          : spellcheckSuggestion.collationQuery;
        if (suggestion) {
          return { suggestion };
        }

        // Check suggester suggestions if there were no spellcheck suggestions
        const suggesterSuggestion =
          solrRes.suggest?.[type ?? 'default']?.[query]?.suggestions?.[0] ??
          null;
        suggestion = !suggesterSuggestion ? null : suggesterSuggestion.term;
        return suggestion ? { suggestion } : {};
      }

      // Look for the type of docs that necessitate additional queries and gather the additional IDs we need to query for
      const queryIds = Array.from(
        new Set(
          solrRes.response.docs
            .filter(
              (doc) =>
                doc['type'] === SolrEntryEnum.Doc ||
                doc['type'] === SolrEntryEnum.Qna
            )
            .flatMap(
              (doc) =>
                [doc['team'], doc['creator'], doc['maintainer']].filter(
                  (val) => typeof val === 'string' && val
                ) as string[]
            )
        )
      );

      // Execute the additional query
      const idsRes = queryIds.length
        ? await this.solrCli.realTimeGetByIds(organization.id, queryIds)
        : null;

      // Take the org members resulting from the additional query and map them from their IDs to the information we care about
      const orgMemberMap = new Map(
        idsRes?.response.docs
          .filter((doc) => doc['type'] === SolrEntryEnum.User)
          .map((doc) => [doc.id, this.handleOrgMember(doc)]) ?? []
      );

      // Take the teams resulting from the additional query and map them from their IDs to the information we care about
      const teamMap = new Map(
        idsRes?.response.docs
          .filter((doc) => doc['type'] === SolrEntryEnum.Team)
          .map((doc) => [doc.id, this.handleTeam(doc)])
      );

      // Construct a map form the highlighting portion of the original response
      const highlightMap = new Map(
        Object.entries(solrRes.highlighting ?? {}).filter(
          ([, highlightedFields]) => Object.keys(highlightedFields).length
        )
      );

      // Iterate through the responses to construct the result
      solrRes.response.docs.forEach((doc) => {
        const type = doc['type'];
        switch (type) {
          case SolrEntryEnum.User: {
            result.orgMember = result.orgMember ?? { offset, results: [] };
            result.orgMember.results.push(this.handleOrgMember(doc));
            break;
          }
          case SolrEntryEnum.Team: {
            result.team = result.team ?? { offset, results: [] };
            result.team.results.push(this.handleTeam(doc));
            break;
          }
          case SolrEntryEnum.Doc: {
            result.doc = result.doc ?? { offset, results: [] };
            result.doc.results.push(
              this.handleDoc(doc, orgMemberMap, teamMap, highlightMap)
            );
            break;
          }
          case SolrEntryEnum.Qna: {
            result.qna = result.qna ?? { offset, results: [] };
            result.qna.results.push(
              this.handleQna(doc, orgMemberMap, teamMap, highlightMap)
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
   * A helper function that takes in a doc response and converts it to an `OrgMemberQueryResult`.
   * Does not check if the doc is of the right type, that responsibility falls on the caller.
   *
   * @param doc The doc response to convert.
   *
   * @returns The `OrgMemberQueryResult` resulting from the doc.
   */
  private handleOrgMember(doc: DocResponse): OrgMemberQueryResult {
    return {
      slug: doc['slug'] as string,
      name: doc['user_name'] as string,
      displayName: (doc['user_display_name'] as string | undefined) ?? null,
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
  private handleTeam(doc: DocResponse): TeamQueryResult {
    return { slug: doc['slug'] as string, name: doc['team_name'] as string };
  }

  /**
   * A helper function that takes in a doc response and converts it to a `DocQueryResult`.
   * Does not check if the doc is of the right type, that responsibility falls on the caller.
   *
   * @param doc The doc response to convert.
   * @param orgMemberMap A map mapping an org member's ID to the org member.
   * @param teamMap A map mapping a team's ID to the team.
   * @param highlightMap A map mapping a doc's ID to its highlighted fields.
   *
   * @returns The `DocQueryResult` resulting from the doc.
   */
  private handleDoc(
    doc: DocResponse,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightMap: Map<string, HighlightedFields>
  ): DocQueryResult {
    const {
      id,
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
      markedUpToDateAt: new Date(marked_up_to_date_at as string),
      upToDate: up_to_date as boolean,
      title: doc_title as string,
      slug: slug as string,
      team: teamMap.get(team as string) ?? null,
      creator: orgMemberMap.get(creator as string) as OrgMemberQueryResult,
      maintainer: orgMemberMap.get(maintainer as string) ?? null,
      docSnippet: highlightMap.get(id)?.['doc_txt']?.[0] ?? (doc_txt as string),
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
   *
   * @returns The `QnaQueryResult` resulting from the doc.
   */
  private handleQna(
    doc: DocResponse,
    orgMemberMap: Map<string, OrgMemberQueryResult>,
    teamMap: Map<string, TeamQueryResult>,
    highlightMap: Map<string, HighlightedFields>
  ): QnaQueryResult {
    const {
      id,
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
      markedUpToDateAt: new Date(marked_up_to_date_at as string),
      upToDate: up_to_date as boolean,
      title: qna_title as string,
      slug: slug as string,
      team: teamMap.get(team as string) ?? null,
      creator: orgMemberMap.get(creator as string) as OrgMemberQueryResult,
      maintainer: orgMemberMap.get(maintainer as string) ?? null,
      questionSnippet:
        highlightMap.get(id)?.['question_txt']?.[0] ?? (question_txt as string),
      answerSnippet:
        highlightMap.get(id)?.['answer_txt']?.[0] ?? (answer_txt as string),
    };
  }
}
