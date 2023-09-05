import { OrgRoleEnum, SolrEntryEnum } from '@newbee/shared/util';
import type { DocResponse, HighlightedFields } from '@newbee/solr-cli';

/**
 * All of the fields of a Solr doc that we care about, minus what is included in the cli itself (`id` and `_version_`).
 * Made so that we can add new docs to Solr with type safety.
 * The property types represent the possible types that Solr will accept as defined in our schema, not necessarily what we'll actually use in the backend to convert an entity to a Solr doc.
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
   * The email of the org member the doc represents, if the doc is an org member.
   */
  user_email?: string;

  /**
   * The name of the org member the doc represents, if the doc is an org member.
   */
  user_name?: string;

  /**
   * The display name of the org member the doc represents, if the doc is an org member.
   */
  user_display_name?: string | null;

  /**
   * The phone number of the org member the doc represents, if the doc is an org member.
   */
  user_phone_number?: string | null;

  /**
   * The org role of the org member the doc represents, if the doc is an org member.
   */
  org_role?: OrgRoleEnum;

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
   * The title of the post, if the doc is a doc or a qna.
   */
  title?: string;

  /**
   * The user that created the post, if the doc is a doc or a qna.
   */
  creator?: string | null;

  /**
   * The user responsible for maintaining the post, if the doc is a doc or a qna.
   */
  maintainer?: string | null;

  /**
   * The body of the doc, if the doc is a doc.
   */
  doc_txt?: string | string[];

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
 * Made so that we can interpret Solr search responses with safety.
 * Fields in `SolrDocFields` are only redefined if the retrieved type differs from its definition in `SolrDocFields`.
 *
 */
export interface SolrDoc extends SolrDocFields, DocResponse {
  /**
   * @inheritdoc
   */
  user_display_name?: string;

  /**
   * @inheritdoc
   */
  user_phone_number?: string;

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
  creator?: string;

  /**
   * @inheritdoc
   */
  maintainer?: string;

  /**
   * @inheritdoc
   */
  doc_txt?: string;

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
 * A Solr doc response that represents an org member.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export interface OrgMemberSolrDoc extends SolrDoc {
  /**
   * @inheritdoc
   */
  user_email: string;

  /**
   * @inheritdoc
   */
  user_name: string;

  /**
   * @inheritdoc
   */
  org_role: OrgRoleEnum;
}

/**
 * A Solr doc response that represents a team.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export interface TeamSolrDoc extends SolrDoc {
  /**
   * @inheritdoc
   */
  team_name: string;
}

/**
 * A Solr doc response that represents a post.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export interface PostSolrDoc extends SolrDoc {
  /**
   * @inheritdoc
   */
  created_at: string;

  /**
   * @inheritdoc
   */
  updated_at: string;

  /**
   * @inheritdoc
   */
  marked_up_to_date_at: string;

  /**
   * @inheritdoc
   */
  up_to_date: boolean;

  /**
   * @inheritdoc
   */
  title: string;
}

/**
 * A Solr doc response that represents a doc.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export interface DocSolrDoc extends PostSolrDoc {
  /**
   * @inheritdoc
   */
  doc_txt: string;
}

/**
 * A Solr doc response that represents a qna.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export type QnaSolrDoc = PostSolrDoc;

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
