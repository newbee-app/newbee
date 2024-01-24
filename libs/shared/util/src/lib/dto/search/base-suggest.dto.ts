import { SolrEntryEnum } from '../../enum';

/**
 * The DTO sent from the frontend to the backend to execute a query.
 * Suitable for use in GET requests.
 */
export class BaseSuggestDto {
  /**
   * The query itself.
   */
  query = '';

  /**
   * The type of entry to look for.
   * Don't specify to search in all.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  type?: SolrEntryEnum;
}
