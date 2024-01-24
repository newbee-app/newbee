import { defaultLimit } from '../../constant';
import { OffsetAndLimit } from '../../interface';
import { BaseSuggestDto } from './base-suggest.dto';

/**
 * The DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in GET requests.
 */
export class BaseQueryDto extends BaseSuggestDto implements OffsetAndLimit {
  /**
   * @inheritdoc
   */
  offset = 0;

  /**
   * @inheritdoc
   */
  limit = defaultLimit;

  /**
   * The slug of the team to limit the search to.
   * Don't specify to search across the entire org.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  team?: string;

  /**
   * The slug of the org member to limit the search to.
   * Don't specify to search across all creators and maintainers.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  member?: string;

  /**
   * The slug of the org member creator to limit the search to.
   * Don't specify to search across all creators.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  creator?: string;

  /**
   * The slug of the org member maintainer to limit the search to.
   * Don't specify to search across all maintainers.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  maintainer?: string;
}
