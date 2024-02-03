import type { OrgMemberUser, Post, Team } from '../interface';

/**
 * The parts of an org member that matter for a query result.
 */
export type OrgMemberQueryResult = OrgMemberUser;

/**
 * The parts of a team that matter for a query result.
 */
export type TeamQueryResult = Omit<Team, 'upToDateDuration'>;

/**
 * The parts of a post that matter for a query result.
 */
export type PostQueryResult = Omit<Post, 'upToDateDuration'>;

/**
 * All of the relations of a post.
 */
export type PostQueryResultRelation = {
  /**
   * The team the post belongs to, if any.
   */
  team: TeamQueryResult | null;

  /**
   * The org member who created the post.
   */
  creator: OrgMemberQueryResult | null;

  /**
   * The org member who maintains the doc.
   */
  maintainer: OrgMemberQueryResult | null;
};

/**
 * The parts of a doc that matter for a query result.
 */
export type DocQueryResult = PostQueryResultRelation & {
  /**
   * The doc itself.
   */
  doc: PostQueryResult & {
    /**
     * A snippet of the doc to be displayed as a search result.
     */
    docSnippet: string;
  };
};

/**
 * The parts of a qna that matter for a query result.
 */
export type QnaQueryResult = PostQueryResultRelation & {
  qna: PostQueryResult & {
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
 * A union type representing all possible query types.
 */
export type QueryResultType =
  | OrgMemberQueryResult
  | TeamQueryResult
  | DocQueryResult
  | QnaQueryResult;
