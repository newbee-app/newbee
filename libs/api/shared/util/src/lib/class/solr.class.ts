import {
  AppSearchResultType,
  DocSearchResult,
  OrgMemberSearchResult,
  OrgRoleEnum,
  OrgSearchResultType,
  QnaSearchResult,
  SolrAppEntryEnum,
  SolrOrgEntryEnum,
  TeamSearchResult,
  UserRoleEnum,
  UserSearchResult,
  WaitlistMemberSearchResult,
} from '@newbee/shared/util';
import { DocResponse, HighlightedFields } from '@newbee/solr-cli';
import { solrOrgDefaultHighlightedFields } from '../constant';

/**
 * All of the fields of a Solr org doc that we care about.
 * Made so that we can add new org docs to Solr with type safety.
 * The property types represent the possible types that Solr will accept as defined in our schema.
 */
export abstract class SolrOrgFields {
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
    readonly entry_type: SolrOrgEntryEnum,
    readonly slug: string,
    readonly created_at: Date,
    readonly updated_at: Date,
    partials: Partial<SolrOrgFields>,
  ) {
    Object.assign(this, partials);
  }
}

/**
 * All of the fields of a Solr app doc that we care about.
 * Made so that we can add new app docs to Solr with type safety.
 * The property types represent the possible types that Solr will accept as defined in our schema.
 */
export abstract class SolrAppFields {
  /**
   * The version of the doc, for use in optimistic concurrency.
   * Only relevant when updating or retrieving a doc, as opposed to inserting a new doc.
   */
  readonly _version_?: bigint;

  // START: user docs

  /**
   * The email of the user the doc represents, if the doc is a user.
   */
  readonly user_email?: string;

  /**
   * The name of the user the doc represents, if the doc is a user.
   */
  readonly user_name?: string;

  /**
   * The display name of the user the doc represents, if the doc is a user.
   */
  readonly user_display_name?: string | null;

  /**
   * The phone number of the user the doc represents, if the doc is a user.
   */
  readonly user_phone_number?: string | null;

  /**
   * The role of the user the doc represents, if the doc is a user.
   */
  readonly user_app_role?: UserRoleEnum;

  /**
   * Whether the user has verified their email, if the doc is a user.
   */
  readonly user_email_verified?: boolean;

  // END: user docs

  // START: waitlist docs

  /**
   * The email of the watilist member the doc represents, if the doc is a waitlist member.
   */
  readonly waitlist_email?: string;

  /**
   * The name of the waitlist member the doc represents, if the doc is a waitlist member.
   */
  readonly waitlist_name?: string;

  // END: waitlist docs

  /**
   * @param id The unique ID for the doc.
   * @param entry_type What type of entry the doc represents.
   * @param created_at When the doc was created.
   * @param updated_at When the doc was last updated.
   * @param partials All of the optional fields of the class.
   */
  constructor(
    readonly id: string,
    readonly entry_type: SolrAppEntryEnum,
    readonly created_at: Date,
    readonly updated_at: Date,
    partials: Partial<SolrAppFields>,
  ) {
    Object.assign(this, partials);
  }
}

/**
 * All of the parts of a Solr org doc response that we care about.
 * Made so that we can interpret Solr search responses with safety.
 * Fields are only redefined if they need to be narrowed, as fields can only be a string or undefined whenever it's retrieved from Solr.
 *
 */
export abstract class SolrOrgDoc extends SolrOrgFields {
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
      entry_type as SolrOrgEntryEnum,
      slug as string,
      new Date(created_at as string),
      new Date(updated_at as string),
      restDoc,
    );
    this._version_ = _version_;
  }

  /**
   * A function to convert this instance into its associated search result type.
   *
   * @param args Whatever args are needed to help convert the instance into a search result.
   *
   * @returns The object as its associated search result type.
   */
  abstract toSearchResult(...args: unknown[]): OrgSearchResultType;
}

/**
 * All of the parts of a Solr app doc response that we care about.
 * Made so that we can interpret Solr search responses with safety.
 * Fields are only redefined if they need to be narrowed, as fields can only be a string or undefined whenever it's retrieved from Solr.
 *
 */
export abstract class SolrAppDoc extends SolrAppFields {
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
  override readonly user_app_role?: UserRoleEnum;

  constructor(doc: DocResponse) {
    const { _version_, id, entry_type, created_at, updated_at, ...restDoc } =
      doc;
    super(
      id,
      entry_type as SolrAppEntryEnum,
      new Date(created_at as string),
      new Date(updated_at as string),
      restDoc,
    );
    this._version_ = _version_;
  }

  /**
   * A function to convert this instance into its associated search result type.
   *
   * @returns The object as its associated search result type.
   */
  abstract toSearchResult(): AppSearchResultType;
}

/**
 * A Solr org doc response that represents a post.
 * Fields are only redefined if they are guaranteed to exist for posts.
 */
export abstract class PostSolrOrgDoc extends SolrOrgDoc {
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
 * A Solr org doc response that represents a doc.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class DocSolrOrgDoc extends PostSolrOrgDoc {
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

  /**
   * @inheritdoc
   *
   * @param orgMembers A map mapping org member IDs to org member search results.
   * @param teams A map mapping team IDs to team search results.
   * @param highlightedFields An object containing this doc's highlighted fields.
   */
  override toSearchResult(
    orgMembers: Map<string, OrgMemberSearchResult>,
    teams: Map<string, TeamSearchResult>,
    highlightedFields: HighlightedFields = {},
  ): DocSearchResult {
    return {
      doc: {
        createdAt: this.created_at,
        updatedAt: this.updated_at,
        markedUpToDateAt: this.marked_up_to_date_at,
        outOfDateAt: this.out_of_date_at,
        title: this.doc_title,
        slug: this.slug,
        docSnippet:
          highlightedFields[solrOrgDefaultHighlightedFields.doc_txt]?.[0] ??
          this.doc_txt.slice(0, 100),
      },
      creator: orgMembers.get(this.creator_id ?? '') ?? null,
      maintainer: orgMembers.get(this.maintainer_id ?? '') ?? null,
      team: teams.get(this.team_id ?? '') ?? null,
    };
  }
}

/**
 * A Solr org doc response that represents a qna.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class QnaSolrOrgDoc extends PostSolrOrgDoc {
  /**
   * @inheritdoc
   */
  override readonly qna_title: string;

  constructor(doc: DocResponse) {
    const { qna_title, ...restDoc } = doc;
    super(restDoc);
    this.qna_title = qna_title as string;
  }

  /**
   * @inheritdoc
   *
   * @param orgMembers A map mapping org member IDs to org member search results.
   * @param teams A map mapping team IDs to team search results.
   * @param highlightedFields An object containing this doc's highlighted fields.
   */
  override toSearchResult(
    orgMembers: Map<string, OrgMemberSearchResult>,
    teams: Map<string, TeamSearchResult>,
    highlightedFields: HighlightedFields = {},
  ): QnaSearchResult {
    return {
      qna: {
        createdAt: this.created_at,
        updatedAt: this.updated_at,
        markedUpToDateAt: this.marked_up_to_date_at,
        outOfDateAt: this.out_of_date_at,
        title: this.qna_title,
        slug: this.slug,
        questionSnippet:
          highlightedFields[
            solrOrgDefaultHighlightedFields.question_txt
          ]?.[0] ??
          this.question_txt?.slice(0, 100) ??
          null,
        answerSnippet:
          highlightedFields[solrOrgDefaultHighlightedFields.answer_txt]?.[0] ??
          this.answer_txt?.slice(0, 100) ??
          null,
      },
      creator: orgMembers.get(this.creator_id ?? '') ?? null,
      maintainer: orgMembers.get(this.maintainer_id ?? '') ?? null,
      team: teams.get(this.team_id ?? '') ?? null,
    };
  }
}

/**
 * A Solr org doc response that represents a team.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class TeamSolrOrgDoc extends SolrOrgDoc {
  /**
   * @inheritdoc
   */
  override readonly team_name: string;

  constructor(doc: DocResponse) {
    const { team_name, ...restDoc } = doc;
    super(restDoc);
    this.team_name = team_name as string;
  }

  /**
   * @inheritdoc
   */
  override toSearchResult(): TeamSearchResult {
    return {
      slug: this.slug,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      name: this.team_name,
    };
  }
}

/**
 * A Solr org doc response that represents an org member.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class OrgMemberSolrOrgDoc extends SolrOrgDoc {
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

  /**
   *
   * @returns @inheritdoc
   */
  override toSearchResult(): OrgMemberSearchResult {
    return {
      orgMember: {
        slug: this.slug,
        createdAt: this.created_at,
        updatedAt: this.updated_at,
        role: this.user_org_role,
      },
      user: {
        email: this.user_email,
        name: this.user_name,
        displayName: this.user_display_name ?? null,
        phoneNumber: this.user_phone_number ?? null,
      },
    };
  }
}

/**
 * A Solr app doc response that represents a user.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class UserSolrAppDoc extends SolrAppDoc {
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
  override readonly user_app_role: UserRoleEnum;

  /**
   * @inheritdoc
   */
  override readonly user_email_verified: boolean;

  constructor(doc: DocResponse) {
    const {
      user_email,
      user_name,
      user_app_role,
      user_email_verified,
      ...restDoc
    } = doc;
    super(restDoc);
    this.user_email = user_email as string;
    this.user_name = user_name as string;
    this.user_app_role = user_app_role as UserRoleEnum;
    this.user_email_verified = user_email_verified as boolean;
  }

  /**
   * @inheritdoc
   */
  override toSearchResult(): UserSearchResult {
    return {
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      email: this.user_email,
      name: this.user_name,
      displayName: this.user_display_name ?? null,
      phoneNumber: this.user_phone_number ?? null,
      role: this.user_app_role,
      emailVerified: this.user_email_verified,
    };
  }
}

/**
 * A Solr app doc response that represents a waitlist member.
 * Fields are only redefined if they are guaranteed to exist for this type of Solr doc.
 */
export class WaitlistSolrAppDoc extends SolrAppDoc {
  /**
   * @inheritdoc
   */
  override readonly waitlist_email: string;

  /**
   * @inheritdoc
   */
  override readonly waitlist_name: string;

  constructor(doc: DocResponse) {
    const { waitlist_email, waitlist_name, ...restDoc } = doc;
    super(restDoc);
    this.waitlist_email = waitlist_email as string;
    this.waitlist_name = waitlist_name as string;
  }

  override toSearchResult(): WaitlistMemberSearchResult {
    return {
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      email: this.waitlist_email,
      name: this.waitlist_name,
    };
  }
}
