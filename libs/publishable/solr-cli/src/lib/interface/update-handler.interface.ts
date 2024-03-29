import type { DocInput } from './shared.interface';

/**
 * All of the parameters for ADDing a doc to a collection.
 */
export interface AddDocParams {
  /**
   * A unique key for the doc in the index.
   */
  id: string;

  /**
   * The version of the doc, if you want to do a replace and not an add.
   * Not mandatory for a replace, just if you want to use optimistic concurrency.
   */
  _version_?: bigint;

  /**
   * The fields for the doc.
   */
  [docFields: string]: DocInput;
}

/**
 * All of the parameters for DELETEing a doc from a collection.
 */
export interface DeleteDocParams {
  /**
   * Delete a doc via an ID. Cannot be used with `query`.
   */
  id?: string;

  /**
   * Delete a doc via a query. Cannot be used with `id`.
   */
  query?: string;
}

/**
 * All of the parameters for performing a
 */
export interface UpdateDocParams {
  /**
   * The ID of the doc to update.
   */
  id: string;

  /**
   * The version of the doc to update, to prevent concurrency issues.
   */
  _version_?: bigint;

  /**
   * The doc field to update.
   */
  [docFields: string]:
    | {
        /**
         * Set or replace the field value(s) with the specified value(s), or remove the values if 'null' or empty list is specified as the new value. May be specified as a single value, or as a list for multiValued fields.
         */
        set?: DocInput;

        /**
         * Adds the specified values to a multiValued field. May be specified as a single value, or as a list.
         */
        add?: DocInput;

        /**
         * Adds the specified values to a multiValued field, only if not already present. May be specified as a single value, or as a list.
         */
        'add-distinct'?: DocInput;

        /**
         * Removes (all occurrences of) the specified values from a multiValued field. May be specified as a single value, or as a list.
         */
        remove?: DocInput;

        /**
         * Removes all occurrences of the specified regex from a multiValued field. May be specified as a single value, or as a list.
         */
        removeregex?: DocInput;

        /**
         * Increments or decrements a numeric field’s value by a specific amount, specified as a single integer or float. Postive amounts increment the field’s value, and negative decrement.
         */
        inc?: number;
      }
    | string
    | bigint;
}

/**
 * The parameters for a bulk doc request.
 */
export interface BulkDocRequestParams {
  add?: AddDocParams | AddDocParams[];
  delete?: DeleteDocParams | DeleteDocParams[];
}
