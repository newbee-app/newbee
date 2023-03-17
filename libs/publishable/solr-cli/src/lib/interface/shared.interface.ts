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
  _version_: number;

  /**
   * Other values for the doc, which will vary depending on the schema.
   */
  [docFields: string]:
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[];
}
