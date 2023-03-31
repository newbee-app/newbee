import type {
  DocQueryResult,
  OrgMemberQueryResult,
  QnaQueryResult,
  TeamQueryResult,
} from '@newbee/shared/util';

/**
 * The DTO sent from the backend to the frontend as a result of a query request.
 */
export class BaseQueryResultDto {
  /**
   * Org members that match the query.
   */
  orgMember?: Result<OrgMemberQueryResult>;

  /**
   * Teams that match the query.
   */
  team?: Result<TeamQueryResult>;

  /**
   * Docs that match the query.
   */
  doc?: Result<DocQueryResult>;

  /**
   * Qnas that match the query.
   */
  qna?: Result<QnaQueryResult>;

  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   */
  suggestion?: string;
}

/**
 * The format of a query result by category.
 */
interface Result<T> {
  /**
   * The page set from which to start listing results.
   */
  offset: number;

  /**
   * The results themselves.
   */
  results: T[];
}
