/**
 * The DTO sent from the backend to the frontend as a result of a query request.
 */
export class SuggestResultsDto {
  /**
   * @param suggestions The suggestions for the query.
   */
  constructor(readonly suggestions: string[]) {}
}
