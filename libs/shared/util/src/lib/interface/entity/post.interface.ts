import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with a post.
 * A post can be either a doc or a QnA.
 * Stored as an abstract entity in the backend.
 */
export interface Post extends CommonEntityFields {
  /**
   * The DateTime or datetime string when the post was last marked up-to-date.
   */
  readonly markedUpToDateAt: Date | string;

  /**
   * The title of the post.
   * For a doc, it's the doc's actual title.
   * The a qna, it's the headline of the question.
   */
  readonly title: string;

  /**
   * The slug to use to represent the post as a link.
   * The slug should be globally unique, as it's a shortened version of the UUID.
   */
  readonly slug: string;

  /**
   * The amount of time to wait before marking a post as out-of-date, represented as an ISO 8601 duration string.
   * If null, inherits from the post's parent team or organization.
   */
  readonly upToDateDuration: string | null;

  /**
   * The DateTime or datetime string when the post is out-of-date, based on its `upToDateDuration` and `markedUpToDateAt` values.
   */
  readonly outOfDateAt: Date | string;
}
