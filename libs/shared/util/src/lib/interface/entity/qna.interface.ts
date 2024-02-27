import type { Post } from './post.interface';

/**
 * The information associated with a QnA.
 * Stored as an entity in the backend.
 */
export interface Qna extends Post {
  /**
   * The raw markdoc of the question portion of the QnA.
   * Can be null if the question is encapsulated by the title, and requires no further details.
   */
  readonly questionMarkdoc: string | null;

  /**
   * The raw markdoc of the question rendered into HTML, for display on the frontend.
   */
  readonly questionHtml: string | null;

  /**
   * The raw markdoc of the answer portion of the QnA.
   * Can be null if no one has answered the question yet.
   */
  readonly answerMarkdoc: string | null;

  /**
   * The raw markdoc of the answer rendered into HTML, for display on the frontend.
   */
  readonly answerHtml: string | null;
}
