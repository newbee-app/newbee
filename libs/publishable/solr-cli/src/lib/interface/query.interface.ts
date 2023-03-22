/**
 * The parameters for making a query to Solr.
 */
export interface QueryParams {
  /**
   * The query string itself.
   */
  query: string;

  /**
   * Defines a query that can be used to restrict the superset of documents that can be returned, without influencing score. Specified in `<field>:<query>` format.
   */
  filter?: string | string[];

  /**
   * Specifies an offset into a query’s result set and instructs Solr to begin displaying results from this offset. Default is `0`.
   */
  offset?: number;

  /**
   * The parameter specifies the maximum number of documents from the complete result set that Solr should return to the client at one time. Default is `10`.
   */
  limit?: number;

  /**
   * Limits the information included in a query response to a specified list of fields. The fields must be either `stored="true"` or `docValues="true"` and `useDocValuesAsStored="true"`.
   */
  fields?: string | string[];

  /**
   * Arranges search results in either ascending (`asc`) or descending (`desc`) order. Specified in `<field> <asc-desc>` format. Default value is `score desc`.
   */
  sort?: string | string[];
}
