/**
 * The payload to turn into the authorization JWT for use on the frontend.
 */
export interface UserJwtPayload {
  /**
   * The user's ID.
   */
  sub: string;
}
