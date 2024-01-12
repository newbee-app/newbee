/**
 * The DTO sent from the backend to the frontend as a result of a query request.
 */
export class BaseSuggestResultsDto {
  /**
   * The suggestions for the query.
   */
  suggestions!: string[];
}
