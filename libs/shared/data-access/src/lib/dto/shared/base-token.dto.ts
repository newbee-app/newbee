/**
 * The DTO sent from the frontend to the backend to send a token.
 * Suitable for use in any request.
 */
export class BaseTokenDto {
  /**
   * The token to send.
   */
  token!: string;
}
