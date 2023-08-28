import type {
  DocNoOrg,
  OrgMemberUser,
  Post,
  QnaNoOrg,
  Team,
} from '../interface';

/**
 * The parts of an org member that matter for a query result.
 */
export type OrgMemberQueryResult = OrgMemberUser;

/**
 * The parts of a team that matter for a query result.
 */
export type TeamQueryResult = Team;

/**
 * The parts of a doc that matter for a query result.
 */
export type DocQueryResult = Omit<DocNoOrg, 'doc'> & {
  doc: Post & {
    /**
     * A snippet of the doc to be displayed as a search result.
     */
    docSnippet: string;
  };
};

/**
 * The parts of a qna that matter for a query result.
 */
export type QnaQueryResult = Omit<QnaNoOrg, 'qna'> & {
  qna: Post & {
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
