import { OrgRoleEnum, SolrEntryEnum } from '@newbee/shared/util';
import { DocResponse } from '@newbee/solr-cli';

/**
 * All of the fields of a Solr doc that we care about.
 * Made so that we can add new docs to Solr with type safety.
 * The property types represent the possible types that Solr will accept as defined in our schema, not necessarily what we'll actually use in the backend to convert an entity to a Solr doc.
 */
export class SolrDocFields {
  /**
   * The version of the doc, for use in optimistic concurrency.
   * Only relevant when updating or retrieving a doc, as opposed to inserting a new doc.
   */
  readonly _version_?: bigint;

  // START: org mbmer docs

  /**
   * The email of the org member the doc represents, if the doc is an org member.
   */
  readonly user_email?: string;

  /**
   * The name of the org member the doc represents, if the doc is an org member.
   */
  readonly user_name?: string;

  /**
   * The display name of the org member the doc represents, if the doc is an org member.
   */
  readonly user_display_name?: string | null;

  /**
   * The phone number of the org member the doc represents, if the doc is an org member.
   */
  readonly user_phone_number?: string | null;

  /**
   * The org role of the org member the doc represents, if the doc is an org member.
   */
  readonly user_org_role?: OrgRoleEnum;

  // END: org member docs

  // START: team docs

  /**
   * The name of the team the doc represents, if the doc is a team.
   */
  readonly team_name?: string;

  // END: team docs

  // START: post docs

  /**
   * The ID of the team the post belongs to, if the doc is a doc or a qna.
   */
  readonly team_id?: string | null;

  /**
   * When the post was last marked up-to-date, if the doc is a doc or a qna.
   */
  readonly marked_up_to_date_at?: Date | string;

  /**
   * When the post should be considered out-of-date, if the doc is a doc or a qna.
   */
  readonly out_of_date_at?: Date | string;

  /**
   * The user that created the post, if the doc is a doc or a qna.
   */
  readonly creator_id?: string | null;

  /**
   * The user responsible for maintaining the post, if the doc is a doc or a qna.
   */
  readonly maintainer_id?: string | null;

  // START: doc docs

  /**
   * The title of the doc, if the doc is a doc.
   */
  readonly doc_title?: string;

  /**
   * The body of the doc, if the doc is a doc.
   */
  readonly doc_txt?: string;

  // END: doc docs

  // START: qna docs

  /**
   * The title of the qna, if the doc is a qna.
   */
  readonly qna_title?: string;

  /**
   * The details of the question, if the doc is a qna.
   */
  readonly question_txt?: string | null;

  /**
   * The answer to the question, if the doc is a qna.
   */
  readonly answer_txt?: string | null;

  // END: qna docs

  // END: post docs

  /**
   * @param id The unique ID for the doc.
   * @param entry_type What type of entry the doc represents.
   * @param slug The slug associated with the doc.
   * @param created_at When the doc was created.
   * @param updated_at When the doc was last updated.
   * @param partials All of the optional fields of the class.
   */
  constructor(
    readonly id: string,
    readonly entry_type: SolrEntryEnum,
    readonly slug: string,
    readonly created_at: Date,
    readonly updated_at: Date,
    partials: Omit<
      SolrDocFields,
      'id' | 'entry_type' | 'slug' | 'created_at' | 'updated_at'
    >,
  ) {
    Object.assign(this, partials);
  }
}

/**
 * All of the parts of a Solr doc response that we care about.
 * Made so that we can interpret Solr search responses with safety.
 * Fields are only redefined if they need to be narrowed, as fields can only be a string or undefined whenever it's retrieved from Solr.
 *
 */
export class SolrDoc extends SolrDocFields {
  /**
   * @inheritdoc
   */
  override readonly _version_: bigint;

  /**
   * @inheritdoc
   */
  override readonly user_display_name?: string;

  /**
   * @inheritdoc
   */
  override readonly user_phone_number?: string;

  /**
   * @inheritdoc
   */
  override readonly team_id?: string;

  /**
   * @inheritdoc
   */
  override readonly creator_id?: string;

  /**
   * @inheritdoc
   */
  override readonly maintainer_id?: string;

  /**
   * @inheritdoc
   */
  override readonly question_txt?: string;

  /**
   * @inheritdoc
   */
  override readonly answer_txt?: string;

  constructor(doc: DocResponse) {
    const {
      _version_,
      id,
      entry_type,
      slug,
      created_at,
      updated_at,
      ...restDoc
    } = doc;
    super(
      id,
      entry_type as SolrEntryEnum,
      slug as string,
      new Date(created_at as string),
      new Date(updated_at as string),
      restDoc,
    );
    this._version_ = _version_;
  }
}

/**
 * A Solr doc response that represents a post.
 * Fields are only redefined if they are guaranteed to exist for posts.
 */
export abstract class PostSolrDoc extends SolrDoc {
  /**
   * @inheritdoc
   */
  override readonly marked_up_to_date_at: Date;

  /**
   * @inheritdoc
   */
  override readonly out_of_date_at: Date;

  constructor(doc: DocResponse) {
    const { marked_up_to_date_at, out_of_date_at, ...restDoc } = doc;
    super(restDoc);
    this.marked_up_to_date_at = new Date(marked_up_to_date_at as string);
    this.out_of_date_at = new Date(out_of_date_at as string);
  }
}

/**
 * A Solr doc response that represents a doc.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class DocSolrDoc extends PostSolrDoc {
  /**
   * @inheritdoc
   */
  override readonly doc_title: string;

  /**
   * @inheritdoc
   */
  override readonly doc_txt: string;

  constructor(doc: DocResponse) {
    const { doc_title, doc_txt, ...restDoc } = doc;
    super(restDoc);
    this.doc_title = doc_title as string;
    this.doc_txt = doc_txt as string;
  }
}

/**
 * A Solr doc response that represents a qna.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class QnaSolrDoc extends PostSolrDoc {
  /**
   * @inheritdoc
   */
  override readonly qna_title: string;

  constructor(doc: DocResponse) {
    const { qna_title, ...restDoc } = doc;
    super(restDoc);
    this.qna_title = qna_title as string;
  }
}

/**
 * A Solr doc response that represents a team.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class TeamSolrDoc extends SolrDoc {
  /**
   * @inheritdoc
   */
  override readonly team_name: string;

  constructor(doc: DocResponse) {
    const { team_name, ...restDoc } = doc;
    super(restDoc);
    this.team_name = team_name as string;
  }
}

/**
 * A Solr doc response that represents an org member.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class OrgMemberSolrDoc extends SolrDoc {
  /**
   * @inheritdoc
   */
  override readonly user_email: string;

  /**
   * @inheritdoc
   */
  override readonly user_name: string;

  /**
   * @inheritdoc
   */
  override readonly user_org_role: OrgRoleEnum;

  constructor(doc: DocResponse) {
    const { user_email, user_name, user_org_role, ...restDoc } = doc;
    super(restDoc);
    this.user_email = user_email as string;
    this.user_name = user_name as string;
    this.user_org_role = user_org_role as OrgRoleEnum;
  }
}
