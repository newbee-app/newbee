import { Post } from './post.interface';

/**
 * The information associated with a doc.
 * Stored as an entity in the backend.
 */
export interface Doc extends Post {
  /**
   * The raw markdoc that makes up the doc.
   */
  bodyMarkdoc: string;

  /**
   * The raw markdoc converted into plain text.
   */
  bodyTxt: string;

  // TODO: add this in later once we figure out what we wanna do with markdoc
  // /**
  //  * The raw markdoc of the doc rendered into HTML, for display on the frontend.
  //  */
  // renderedHtml: string;
}
