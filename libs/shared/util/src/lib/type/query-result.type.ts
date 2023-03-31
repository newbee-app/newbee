import type { OrgMember, Post, Team, User } from '../interface';

/**
 * The parts of an org member that matter for a query result.
 */
export type OrgMemberQueryResult = Pick<OrgMember, 'slug'> &
  Pick<User, 'name' | 'displayName'>;

/**
 * The parts of a team that matter for a query result.
 */
export type TeamQueryResult = Team;

/**
 * The parts of a post that matter for a query result.
 */
export type PostQueryResult = Pick<
  Post,
  'markedUpToDateAt' | 'upToDate' | 'title' | 'slug'
> & {
  /**
   * The team associated with the post.
   */
  team: TeamQueryResult | null;

  /**
   * The creator of the post.
   */
  creator: OrgMemberQueryResult;

  /**
   * The maintainer of the post.
   */
  maintainer: OrgMemberQueryResult | null;
};

/**
 * The parts of a doc that matter for a query result.
 */
export type DocQueryResult = PostQueryResult & {
  /**
   * A snippet of the doc to be displayed as a search result.
   */
  docSnippet: string;
};

/**
 * The parts of a qna that matter for a query result.
 */
export type QnaQueryResult = PostQueryResult & {
  /**
   * A snippet of the question to be displayed as a search result.
   */
  questionSnippet: string | null;

  /**
   * A snippet of the answer to be displayed as a search result.
   */
  answerSnippet: string | null;
};
