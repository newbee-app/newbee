/**
 * The information associated with a post.
 * A post can be either a doc or a QnA.
 * Stored as an abstract entity in the backend.
 */
export interface Post {
  /**
   * The DateTime when the post was created.
   */
  createdAt: Date;

  /**
   * The DateTime when the post was last updated.
   */
  updatedAt: Date;

  /**
   * The DateTime when the post was last marked up-to-date.
   */
  markedUpToDateAt: Date;

  /**
   * Whether the post is up-to-date.
   */
  upToDate: boolean;

  /**
   * The slug to use to represent the post as a link.
   * A slug should be unique within an organization.
   */
  slug: string;
}
