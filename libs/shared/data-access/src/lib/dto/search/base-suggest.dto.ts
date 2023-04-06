/**
 * The DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in POST requests.
 */
export class BaseSuggestDto {
  /**
   * The query itself.
   */
  query!: string;
}
