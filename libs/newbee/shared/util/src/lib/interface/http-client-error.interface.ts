/**
 * An interface for convering a `HttpErrorResponse` for internal use.
 */
export interface HttpClientError {
  /**
   * The HTTP status of the error.
   */
  status: number;

  /**
   * The error object itself.
   */
  error: unknown;
}
