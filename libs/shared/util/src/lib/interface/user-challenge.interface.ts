/**
 * The challenge associated with a user, for use in authentication with WebAuthn.
 * Stored as an entity in the backend.
 */
export interface UserChallenge {
  /**
   * The current challenge associated with the user.
   * Value can be null.
   */
  challenge: string | null;
}
