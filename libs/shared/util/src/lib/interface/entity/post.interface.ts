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
   * The title of the post.
   * For a doc, it's the doc's actual title.
   * The a qna, it's the headline of the question.
   */
  title: string;

  /**
   * The slug to use to represent the post as a link.
   * The slug should be globally unique, as it's a shortened version of the UUID.
   */
  slug: string;
}
