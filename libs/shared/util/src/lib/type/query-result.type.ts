import type {
  DocNoOrgTeam,
  OrgMemberUser,
  Post,
  QnaNoOrgTeam,
  Team,
} from '../interface';

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
 * The parts of a doc that matter for a query result.
 */
export type DocQueryResult = Omit<DocNoOrgTeam, 'doc'> & {
  doc: PostQueryResult & {
    /**
     * A snippet of the doc to be displayed as a search result.
     */
    docSnippet: string;
  };

  /**
   * The team the doc belongs to, if any.
   */
  team: TeamQueryResult | null;
};

/**
 * The parts of a qna that matter for a query result.
 */
export type QnaQueryResult = Omit<QnaNoOrgTeam, 'qna'> & {
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

  /**
   * The team the qna belongs to, if any.
   */
  team: TeamQueryResult | null;
};

/**
 * A union type representing all possible query types.
 */
export type QueryResultType =
  | OrgMemberQueryResult
  | TeamQueryResult
  | DocQueryResult
  | QnaQueryResult;
