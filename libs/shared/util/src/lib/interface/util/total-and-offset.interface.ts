/**
 * A utility interface for working with paginated results.
 */
export interface TotalAndOffset {
  /**
   * The total number of results that exist.
   */
  total: number;

  /**
   * The paginated offset we're examining.
   */
  offset: number;
}
