import { SolrEntryEnum } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in POST requests.
 */
export class BaseSuggestDto {
  /**
   * The query itself.
   */
  query!: string;

  /**
   * The type of entry to look for.
   * Leave undefined to search in all.
   */
  type?: SolrEntryEnum;
}
