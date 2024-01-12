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
}
