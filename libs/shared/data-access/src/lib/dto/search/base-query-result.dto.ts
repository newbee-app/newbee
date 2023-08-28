import type { AllQueryResults, QueryResult } from '@newbee/shared/util';

/**
 * The DTO sent from the backend to the frontend as a result of a query request.
 */
export class BaseQueryResultDto implements QueryResult {
  /**
   * @inheritdoc
   */
  total!: number;

  /**
   * @inheritdoc
   */
  offset!: number;

  /**
   * @inheritdoc
   */
  results!: AllQueryResults[];

  /**
   * @inheritdoc
   */
  suggestion?: string;
}
