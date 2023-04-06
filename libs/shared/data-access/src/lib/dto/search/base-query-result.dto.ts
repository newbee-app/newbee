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
   * The page set from which to start listing results.
   */
  offset!: number;

  /**
   * Org members that match the query.
   */
  orgMember?: OrgMemberQueryResult[];

  /**
   * Teams that match the query.
   */
  team?: TeamQueryResult[];

  /**
   * Docs that match the query.
   */
  doc?: DocQueryResult[];

  /**
   * Qnas that match the query.
   */
  qna?: QnaQueryResult[];

  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   */
  suggestion?: string;
}
