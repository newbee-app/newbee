import { Post } from './post.interface';

/**
 * The information associated with a QnA.
 * Stored as an entity in the backend.
 */
export interface Qna extends Post {
  /**
   * The raw markdown of the question portion of the QnA.
   */
  questionMarkdown: string;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  // /**
  //  * The raw markdown of the question rendered into HTML, for display on the frontend.
  //  */
  // renderedQuestion: string;

  /**
   * The raw markdown of the answer portion of the QnA.
   */
  answerMarkdown: string;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  // /**
  //  * The raw markdown of the answer rendered into HTML, for display on the frontend.
  //  */
  // renderedAnswer: string;
}
