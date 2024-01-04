import type { QueryResultType, Sample } from '../../type';

/**
 * Represents the response the frontend receives from the backend after submitting a search query.
 */
export interface QueryResult extends Sample<QueryResultType> {
  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   * `null` if there are no suggestions or several results were found.
   */
  suggestion: string | null;
}
