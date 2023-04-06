import { SolrEntryEnum } from '@newbee/shared/util';
import type { DocResponse, HighlightedFields } from '@newbee/solr-cli';

/**
 * All of the fields of a Solr doc that we care about, minus what is included in the cli itself (`id` and `_version_`).
 */
export interface SolrDocFields {
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
  user_name?: string;

  /**
   * The display name of the org member the doc represents, if the doc is an org member.
   */
  user_display_name?: string | null;

  /**
   * The name of the team the doc represents, if the doc is a team.
   */
  team_name?: string;

  /**
   * The ID of the team the post belongs to, if the doc is a doc or a qna.
   */
  team?: string | null;

  /**
   * When the post was created, if the doc is a doc or a qna.
   */
  created_at?: Date | string;

  /**
   * When the post was last updated, if the doc is a doc or a qna.
   */
  updated_at?: Date | string;

  /**
   * When the post was last marked up-to-date, if the doc is a doc or a qna.
   */
  marked_up_to_date_at?: Date | string;

  /**
   * Whether the post is up-to-date, if the doc is a doc or a qna.
   */
  up_to_date?: boolean;

  /**
   * The user that created the post, if the doc is a doc or a qna.
   */
  creator?: string;

  /**
   * The user responsible for maintaining the post, if the doc is a doc or a qna.
   */
  maintainer?: string | null;

  /**
   * The title of the doc, if the doc is a doc.
   */
  doc_title?: string;

  /**
   * The body of the doc, if the doc is a doc.
   */
  doc_txt?: string | string[];

  /**
   * The title of the qna, if the doc is a qna.
   */
  qna_title?: string;

  /**
   * The details of the question, if the doc is a qna.
   */
  question_txt?: string | string[] | null;

  /**
   * The answer to the question, if the doc is a qna.
   */
  answer_txt?: string | string[] | null;
}

/**
 * All of the parts of a Solr doc response that we care about.
 */
export interface SolrDoc extends SolrDocFields, DocResponse {
  /**
   * @inheritdoc
   */
  user_name?: string;

  /**
   * @inheritdoc
   */
  user_display_name?: string;

  /**
   * @inheritdoc
   */
  team_name?: string;

  /**
   * @inheritdoc
   */
  team?: string;

  /**
   * @inheritdoc
   */
  created_at?: string;

  /**
   * @inheritdoc
   */
  updated_at?: string;

  /**
   * @inheritdoc
   */
  marked_up_to_date_at?: string;

  /**
   * @inheritdoc
   */
  maintainer?: string;

  /**
   * @inheritdoc
   */
  doc_title?: string;

  /**
   * @inheritdoc
   */
  doc_txt?: string;

  /**
   * @inheritdoc
   */
  qna_title?: string;

  /**
   * @inheritdoc
   */
  question_txt?: string;

  /**
   * @inheritdoc
   */
  answer_txt?: string;
}

/**
 * All of the properties that can appear in highlighted fields.
 */
export interface SolrHighlightedFields
  extends Pick<SolrDocFields, 'doc_txt' | 'question_txt' | 'answer_txt'>,
    HighlightedFields {
  /**
   * @inheritdoc
   */
  doc_txt?: string[];

  /**
   * @inheritdoc
   */
  question_txt?: string[];

  /**
   * @inheritdoc
   */
  answer_txt?: string[];
}
