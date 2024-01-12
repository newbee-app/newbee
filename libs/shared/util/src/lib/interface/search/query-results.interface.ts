import type { QueryResultType } from '../../type';
import { PaginatedResults } from '../util';

/**
 * A specialized type of `PaginatedResults` related to fetching and displaying search queries.
 */
export interface QueryResults extends PaginatedResults<QueryResultType> {
  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   * `null` if there are no suggestions or several results were found.
   */
  suggestion: string | null;
}
