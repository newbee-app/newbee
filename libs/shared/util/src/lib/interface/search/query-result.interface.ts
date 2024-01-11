import type { QueryResultType } from '../../type';
import { Result } from '../util';

/**
 * A specialized type of `Result` related to fetching and displaying search queries.
 */
export interface QueryResult extends Result<QueryResultType> {
  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   * `null` if there are no suggestions or several results were found.
   */
  suggestion: string | null;
}
