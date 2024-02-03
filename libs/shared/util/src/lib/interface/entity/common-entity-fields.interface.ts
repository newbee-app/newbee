/**
 * Common fields for most other entity interface to extend.
 */
export interface CommonEntityFields {
  /**
   * The DateTime or datetime string when the post was created.
   */
  createdAt: Date | string;

  /**
   * The DateTime or datetime string when the post was last updated.
   */
  updatedAt: Date | string;
}
