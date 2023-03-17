import type { AddDocParams } from '@newbee/solr-cli';
import { SolrEntryEnum } from '../enum';

/**
 * All of the parts of NewBee's Solr schema that we care about.
 */
export interface SolrSchema extends AddDocParams {
  /**
   * The UUID to associate with the doc.
   */
  id: string;

  /**
   * What type of entry the doc represents.
   */
  entry_type: SolrEntryEnum;

  /**
   * The name of the team or the org member the doc represents, if the doc is a team or an org member.
   */
  name?: string | string[] | null;

  /**
   * The ID of the team the post belongs to, if the doc is a doc or a qna.
   */
  team?: string | null;

  /**
   * When the post was created, if the doc is a doc or a qna.
   */
  created_at?: Date | null;

  /**
   * When the post was last updated, if the doc is a doc or a qna.
   */
  updated_at?: Date | null;

  /**
   * When the post was last marked up-to-date, if the doc is a doc or a qna.
   */
  marked_up_to_date_at?: Date | null;

  /**
   * Whether the post is up-to-date, if the doc is a doc or a qna.
   */
  up_to_date?: boolean | null;

  /**
   * The title of the post, if the doc is a doc or a qna.
   */
  title?: string | null;

  /**
   * The user that created the post, if the doc is a doc or a qna.
   */
  creator?: string | null;

  /**
   * The user responsible for maintaining the post, if the doc is a doc or a qna.
   */
  maintainer?: string | null;

  /**
   * The body of the document, if the doc is a doc.
   */
  doc_body?: string | null;

  /**
   * The details of the question, if the doc is a qna.
   */
  question_details?: string | null;

  /**
   * The answer to the question, if the doc is a qna.
   */
  answer?: string | null;
}
