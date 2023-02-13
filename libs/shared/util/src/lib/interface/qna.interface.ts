import { Post } from './post.interface';

/**
 * The information associated with a QnA.
 * Stored as an entity in the backend.
 */
export interface Qna extends Post {
  /**
   * The raw markdown of the question portion of the QnA.
   * Can be null if the question is encapsulated by the title, and requires no further details.
   */
  questionMarkdown: string | null;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  // /**
  //  * The raw markdown of the question rendered into HTML, for display on the frontend.
  //  */
  // renderedQuestion: string;

  /**
   * The raw markdown of the answer portion of the QnA.
   * Can be null if no one has answered the question yet.
   */
  answerMarkdown: string | null;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  // /**
  //  * The raw markdown of the answer rendered into HTML, for display on the frontend.
  //  */
  // renderedAnswer: string;
}
