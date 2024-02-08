/**
 * The DTO sent from the backend to the frontend after authenticating using Magic Link Login.
 */
export class MagicLinkLoginDto {
  /**
   * @param jwtId The JWT ID associated with the magic link that was just sent to the user's email.
   * @param email The email the magic link was sent to.
   */
  constructor(
    readonly jwtId: string,
    readonly email: string,
  ) {}
}
