import { SolrEntryEnum } from '@newbee/shared/util';
import { BaseSuggestDto } from './base-suggest.dto';

/**
 * The DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in POST requests.
 */
export class BaseQueryDto extends BaseSuggestDto {
  /**
   * The offset from which the result set should be displayed.
   */
  offset = 0;

  /**
   * The type of entry to look for.
   * Specify null to search in all.
   */
  type: SolrEntryEnum | null = null;
}
