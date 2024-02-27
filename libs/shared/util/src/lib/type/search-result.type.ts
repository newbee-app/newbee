import type {
  OrgMemberUser,
  Post,
  Team,
  User,
  WaitlistMember,
} from '../interface';

/**
 * The parts of an org member that matter for a search result.
 */
export type OrgMemberSearchResult = OrgMemberUser;

/**
 * The parts of a team that matter for a search result.
 */
export type TeamSearchResult = Omit<Team, 'upToDateDuration'>;

/**
 * The parts of a post that matter for a search result.
 */
export type PostSearchResult = Omit<Post, 'upToDateDuration'>;

/**
 * All of the relations of a post.
 */
export type PostSearchResultRelation = {
  /**
   * The team the post belongs to, if any.
   */
  team: TeamSearchResult | null;

  /**
   * The org member who created the post.
   */
  creator: OrgMemberSearchResult | null;

  /**
   * The org member who maintains the doc.
   */
  maintainer: OrgMemberSearchResult | null;
};

/**
 * The parts of a doc that matter for a search result.
 */
export type DocSearchResult = PostSearchResultRelation & {
  /**
   * The doc itself.
   */
  doc: PostSearchResult & {
    /**
     * A snippet of the doc to be displayed as a search result.
     */
    docSnippet: string;
  };
};

/**
 * The parts of a qna that matter for a search result.
 */
export type QnaSearchResult = PostSearchResultRelation & {
  qna: PostSearchResult & {
    /**
     * A snippet of the question to be displayed as a search result.
     */
    questionSnippet: string | null;

    /**
     * A snippet of the answer to be displayed as a search result.
     */
    answerSnippet: string | null;
  };
};

/**
 * A union type representing all possible org search result types.
 */
export type OrgSearchResultType =
  | OrgMemberSearchResult
  | TeamSearchResult
  | DocSearchResult
  | QnaSearchResult;

/**
 * The parts of a user that matter for a search result.
 */
export type UserSearchResult = User;

/**
 * The parts of a waitlist member that matter for a search result.
 */
export type WaitlistMemberSearchResult = WaitlistMember;

/**
 * A union type representing all possible app search types.
 */
export type AppSearchResultType = UserSearchResult | WaitlistMemberSearchResult;
