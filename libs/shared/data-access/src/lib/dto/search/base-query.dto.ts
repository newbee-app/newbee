/**
 * The DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in POST requests.
 */
export class BaseQueryDto {
  /**
   * The query itself.
   */
  query!: string;

  /**
   * The offset from which the result set should be displayed.
   */
  offset = 0;
}
