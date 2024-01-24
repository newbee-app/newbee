import { PaginatedResults } from '../../interface';
import { QueryResultType } from '../../type';
import { BaseQueryDto } from './base-query.dto';

/**
 * The DTO sent from the backend to frontend containing the results of a query.
 */
export class BaseQueryResultsDto
  extends BaseQueryDto
  implements PaginatedResults<QueryResultType>
{
  /**
   * @inheritdoc
   */
  results: QueryResultType[] = [];

  /**
   * @inheritdoc
   */
  total = 0;

  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   * `null` if there are no suggestions or several results were found.
   */
  suggestion: string | null = null;
}
