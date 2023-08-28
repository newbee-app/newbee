import type { QueryResultType } from '../../type';

/**
 * Represents the response the frontend receives from the backend after submitting a search query.
 * Need this interface version for the DTO to implement so that the DTO can live in the `data-access` lib and this `util` lib version can be used in all other libs.
 */
export interface QueryResult {
  /**
   * The total number of results that were found.
   */
  total: number;

  /**
   * The page set from which to start listing results.
   */
  offset: number;

  /**
   * The results of the query.
   */
  results: QueryResultType[];

  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   */
  suggestions?: string;
}
