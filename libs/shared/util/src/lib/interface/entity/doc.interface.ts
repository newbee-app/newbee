import type { Post } from './post.interface';

/**
 * The information associated with a doc.
 * Stored as an entity in the backend.
 */
export interface Doc extends Post {
  /**
   * The raw markdoc that makes up the doc.
   */
  docMarkdoc: string;

  /**
   * The raw markdoc of the doc rendered into HTML, for display on the frontend.
   */
  docHtml: string;
}
