import { PaginatedResults } from '../../interface';
import { AppSearchResultType, OrgSearchResultType } from '../../type';
import { AppSearchDto, CommonSearchDto, OrgSearchDto } from './search.dto';

/**
 * The interface for the DTO sent from the backend to the frontend containing the results of a search.
 */
export interface CommonSearchResultsDto
  extends CommonSearchDto,
    PaginatedResults<OrgSearchResultType | AppSearchResultType> {
  /**
   * An alternative query the user might have meant, if the original query found little to no results.
   * `null` if there are no suggestions or several results were found.
   */
  suggestion: string | null;
}

/**
 * The DTO sent from the backend to the frontend containing the results of an org search.
 */
export class OrgSearchResultsDto
  extends OrgSearchDto
  implements CommonSearchResultsDto
{
  /**
   * @inheritdoc
   */
  results: OrgSearchResultType[] = [];

  /**
   * @inheritdoc
   */
  total = 0;

  /**
   * @inheritdoc
   */
  suggestion: string | null = null;
}

/**
 * The DTO sent from the backend to the frontend containing the results of an app search.
 */
export class AppSearchResultsDto
  extends AppSearchDto
  implements CommonSearchResultsDto
{
  /**
   * @inheritdoc
   */
  results: AppSearchResultType[] = [];

  /**
   * @inheritdoc
   */
  total = 0;

  /**
   * @inheritdoc
   */
  suggestion: string | null = null;
}
