/**
 * Used to describe values for an offset and a limit.
 */
export interface OffsetAndLimit {
  /**
   * The paginated set offset we're examining.
   */
  offset: number;

  /**
   * The number of results in each paginated set.
   */
  limit: number;
}
