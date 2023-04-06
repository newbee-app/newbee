/**
 * The parameters needed for basic authentication.
 */
export interface BasicAuth {
  username: string;
  password: string;
}

/**
 * The structure of request header options to be fed into Axios.
 */
export interface RequestHeader {
  /**
   * The Content-Type to use.
   */
  headers: { 'Content-Type': string };

  /**
   * Auth details if Solr is using an authentication plugin.
   */
  auth?: BasicAuth;
}

/**
 * The structure of response headers.
 */
export interface ResponseHeader {
  /**
   * The status of the query, with 0 meaning success and any other value indicating an error.
   */
  status: number;

  /**
   * How long the query took, in milliseconds.
   */
  QTime: number;

  /**
   * Whether the Zookeeper instance is connected.
   */
  zkConnected: boolean;
}

/**
 * The structure of response exceptions.
 */
export interface ResponseException {
  /**
   * The exception message.
   */
  msg: string;

  /**
   * The error code.
   */
  rspCode: number;
}

/**
 * The structure of response errors.
 */
export interface ResponseError {
  /**
   * The Java exceptions thrown by Solr itself.
   */
  metadata: string[];

  /**
   * The error message.
   */
  msg: string;

  /**
   * The error code.
   */
  code: number;
}

/**
 * The structure of the whole response.
 */
export interface SolrResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * Only included if the request is successful.
   */
  success?: {
    /**
     * e.g. `localhost:8983_solr`.
     */
    [nodeName: string]: {
      /**
       * The response header from the individual node.
       */
      responseHeader: ResponseHeader;

      /**
       * The core in the node that sent the response.
       */
      core: string;
    };
  };

  /**
   * Only included if the response includes a warning.
   */
  WARNING?: string;

  /**
   * Only included if CREATE caused an exception.
   */
  'Operation create caused exception:'?: string;

  /**
   * Only included if CREATE causeed an exception.
   */
  exception?: ResponseException;

  /**
   * Only included if CREATE caused an exception.
   */
  error?: ResponseError;
}

/**
 * All of the possible data formats that a doc's field can take.
 */
export type DocInput =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | bigint
  | bigint[]
  | Date
  | Date[]
  | null;

/**
 * The structure of a doc when it's sent as a response by Solr.
 */
export interface DocResponse {
  /**
   * The ID of the doc.
   */
  id: string;

  /**
   * The version of the doc, for use in optimistic concurrency.
   */
  _version_: bigint;

  /**
   * Other values for the doc, which will vary depending on the schema.
   */
  [docFields: string]:
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | bigint
    | bigint[];
}

/**
 * The structure of docs when it's sent as a query response by Solr.
 */
export interface DocsResponse {
  /**
   * The amount of documents found.
   */
  numFound: number;

  /**
   * The result sequence the docs will start from.
   */
  start: number;

  /**
   * Whether the `numFound` value is exact or an approximation.
   */
  numFoundExact: boolean;

  /**
   * The values of the docs themselves.
   */
  docs: DocResponse[];
}

/**
 * The structure of a Solr suggestion.
 */
export interface Suggestion {
  /**
   * The suggestion itself.
   */
  term: string;

  /**
   * The weight of the suggestion.
   */
  weight: number;

  /**
   * The payload for the suggestion.
   */
  payload: string;
}

/**
 * An interface representing highlighted fields.
 */
export interface HighlightedFields {
  /**
   * The field that's highlighted and its highlighted snippets.
   */
  [field: string]: string[];
}

/**
 * The structure of Solr's highlighting response.
 */
export interface Highlights {
  /**
   * The doc that was highlighted mapped to its highlighted fields.
   */
  [docId: string]: HighlightedFields;
}

/**
 * The structure of Solr's spellcheck response.
 */
export interface Spellcheck {
  /**
   * Suggestions for individual search terms, in the format of ['term', { suggestion }]
   */
  suggestions: (
    | string
    | {
        numFound: number;
        startOffset: number;
        endOffset: number;
        origFreq: number;
        suggestion: { word: string; freq: number }[];
      }
  )[];

  /**
   * Whether enough results were generated for the query to be considered "correctly spelled", determined by `spellcheck.maxResultsForSuggest`.
   */
  correctlySpelled: boolean;

  /**
   * Spellchecking suggestions as a collation (spellchecking the whole query, as opposed to individual terms).
   * In the format of ['collation', { collationSuggestion }]
   */
  collations:
    | [
        string,
        {
          collationQuery: string;
          hits: number;
          misspellingsAndCorrections: string[];
        }
      ]
    | [];
}

/**
 * The response to a query request.
 */
export interface QueryResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The response object.
   */
  response: DocsResponse;

  /**
   * Highlighted fields, if highlighting was requested.
   */
  highlighting?: Highlights;

  /**
   * Spellchecking, if spellchecking was requested.
   */
  spellcheck?: Spellcheck;

  /**
   * Suggestioned based on the query, if suggestions were requested.
   */
  suggest?: {
    /**
     * The suggester dictionary that was used.
     */
    [dictionary: string]: {
      /**
       * The query that suggestions were generated for.
       */
      [query: string]: {
        /**
         * The number of suggestions generated.
         */
        numFound: number;

        /**
         * The suggestions themselves.
         */
        suggestions: Suggestion[];
      };
    };
  };
}
