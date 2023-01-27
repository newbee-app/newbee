import { Post } from './post.interface';

/**
 * The information associated with a doc.
 * Stored as an entity in the backend.
 */
export interface Doc extends Post {
  /**
   * The raw markdown that makes up the doc.
   */
  rawMarkdown: string;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  //  * The raw markdown of the doc rendered into HTML, for display on the frontend.
  //  */
  // renderedHtml: string;
}
