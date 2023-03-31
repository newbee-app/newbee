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
  questionMarkdoc: string | null;

  /**
   * The question markdoc converted into plain text.
   */
  questionTxt: string | null;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  // /**
  //  * The raw markdoc of the question rendered into HTML, for display on the frontend.
  //  */
  // questionHtml: string;

  /**
   * The raw markdoc of the answer portion of the QnA.
   * Can be null if no one has answered the question yet.
   */
  answerMarkdoc: string | null;

  /**
   * The answer markdoc converted into plain text.
   */
  answerTxt: string | null;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  // /**
  //  * The raw markdoc of the answer rendered into HTML, for display on the frontend.
  //  */
  // answerHtml: string;
}
