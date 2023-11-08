/**
 * The DTO sent from the backend to the frontend after authenticating using Magic Link Login.
 */
export class BaseMagicLinkLoginDto {
  /**
   * The JWT ID associated with the magic link that was just sent to the user's email.
   */
  jwtId!: string;

  /**
   * The email the magic link was sent to.
   */
  email!: string;
}
