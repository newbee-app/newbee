/**
 * All of the parameters for ADDing multiple docs to a collection.
 */
export interface AddDocsParams {
  /**
   * The parameters for the docs.
   */
  docs: {
    /**
     * The parameters for the doc.
     */
    [docParams: string]:
      | string
      | string[]
      | number
      | number[]
      | boolean
      | boolean[];
  }[];
}

/**
 * All of the parameters for DELETEing a doc from a collection.
 */
export interface DeleteDocsParams {
  /**
   * The IDs of the docs to delete, or a query to find the doc to delete.
   */
  delete: string | string[] | { query: string };

  /**
   * The version of the delete, to avoid concurrency issues.
   */
  _version_?: number;
}
