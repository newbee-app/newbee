import { SolrEntryEnum } from '@newbee/shared/util';
import type { AddDocParams } from '@newbee/solr-cli';

/**
 * All of the parts of NewBee's Solr schema that we care about.
 */
export interface SolrSchema extends AddDocParams {
  /**
   * The UUID to associate with the doc.
   */
  id: string;

  /**
   * The version of the doc, if you want to do a replace/update with optimistic concurrency.
   * Not required, even for a replace/update.
   */
  _version_?: bigint;

  /**
   * What type of entry the doc represents.
   */
  entry_type: SolrEntryEnum;

  /**
   * The slug associated with the doc.
   */
  slug: string;

  /**
   * The name of the org member the doc represents, if the doc is an org member.
   */
  user_name?: string | null;

  /**
   * The display name of the org member the doc represents, if the doc is an org member.
   */
  user_display_name?: string | null;

  /**
   * The name of the team the doc represents, if the doc is a team.
   */
  team_name?: string | null;

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
   * The user that created the post, if the doc is a doc or a qna.
   */
  creator?: string | null;

  /**
   * The user responsible for maintaining the post, if the doc is a doc or a qna.
   */
  maintainer?: string | null;

  /**
   * The title of the doc, if the doc is a doc.
   */
  doc_title?: string | null;

  /**
   * The body of the doc, if the doc is a doc.
   */
  doc_txt?: string | null;

  /**
   * The title of the qna, if the doc is a qna.
   */
  qna_title?: string | null;

  /**
   * The details of the question, if the doc is a qna.
   */
  question_txt?: string | null;

  /**
   * The answer to the question, if the doc is a qna.
   */
  answer_txt?: string | null;
}
