/**
 * Common fields for most other entity interface to extend.
 */
export interface CommonEntityFields {
  /**
   * The DateTime or datetime string when the post was created.
   */
  readonly createdAt: Date | string;

  /**
   * The DateTime or datetime string when the post was last updated.
   */
  readonly updatedAt: Date | string;
}
