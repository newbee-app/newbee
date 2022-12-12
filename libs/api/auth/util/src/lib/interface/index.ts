/**
 * The payload to turn into the authorization JWT for use on the frontend.
 */
export interface UserJwtPayload {
  /**
   * The user's email.
   */
  email: string;

  /**
   * The user's ID.
   */
  sub: string;
}
