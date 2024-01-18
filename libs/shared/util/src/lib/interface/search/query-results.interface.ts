import { SolrEntryEnum } from '../../enum';
import type { QueryResultType } from '../../type';
import { PaginatedResults } from '../util';

/**
 * A specialized type of `PaginatedResults` related to fetching and displaying search queries.
 */
export interface QueryResults extends PaginatedResults<QueryResultType> {
  /**
   * The original query value.
   */
  query: string;

  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   * `null` if there are no suggestions or several results were found.
   */
  suggestion: string | null;

  /**
   * The original type of the query, leave undefined if the search was across all types.
   */
  type?: SolrEntryEnum;

  /**
   * The slug of the team to narrow the search to, leave undefined if the search was across all types.
   */
  team?: string;
}
