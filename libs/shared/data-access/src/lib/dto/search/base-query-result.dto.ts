import type { QueryResult, QueryResultType } from '@newbee/shared/util';

/**
 * The DTO sent from the backend to the frontend as a result of a query request.
 */
export class BaseQueryResultDto implements QueryResult {
  /**
   * @inheritdoc
   */
  total = 0;

  /**
   * @inheritdoc
   */
  results: QueryResultType[] = [];

  /**
   * @inheritdoc
   */
  suggestion: string | null = null;

  constructor(public offset: number) {}
}
