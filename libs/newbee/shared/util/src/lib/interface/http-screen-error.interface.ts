/**
 * An interface for converting an `HttpErrorResponse` for internal use.
 * Used as a way to replace the current screen with a screen meant for displaying the error.
 */
export interface HttpScreenError {
  /**
   * The HTTP status of the error.
   */
  status: number;

  /**
   * The message associated with the error.
   */
  message: string;
}
