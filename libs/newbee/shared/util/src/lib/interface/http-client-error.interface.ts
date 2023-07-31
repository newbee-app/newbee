/**
 * An interface for converting an `HttpErrorResponse` for internal use.
 * Primarily used with forms as a way of providing feedback to the user.
 */
export interface HttpClientError {
  /**
   * The HTTP status of the error.
   */
  status: number;

  /**
   * The messages associated with the error.
   * Either as an object mapped from the target to the message, as an array of messages, or a single message.
   * If an object, the target is the part of the component where the message is meant to be displayed.
   * e.g. `{ email: 'Email field is required' }`
   */
  messages: { [target: string]: string | string[] } | string[] | string;
}
