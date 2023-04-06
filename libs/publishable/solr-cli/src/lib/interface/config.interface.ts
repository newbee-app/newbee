import { ResponseHeader } from './shared.interface';

/**
 * The response from a retrieve config request.
 */
export interface RetrieveConfigResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The values for the config.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
}

/**
 * The response from a retrieve config overlay request.
 */
export interface RetrieveConfigOverlayResponse {
  responseHeader: ResponseHeader;
  overlay: {
    zNodeVersion: number;
    userProps: { [props: string]: string };
  };
}

/**
 * Properties that are a part of a config.
 */
export interface ConfigProperty {
  [property: string]: string | string[] | boolean | number;
}

/**
 * Parameters for adding a request handler.
 */
export interface AddRequestHandlerParams {
  /**
   * The endpoint for the request handler.
   */
  name: string;

  /**
   * The class to use for the request handler.
   */
  class: string;

  /**
   * The default params for the request handler.
   */
  defaults: ConfigProperty;

  /**
   * The param set to use from `params.json`.
   */
  'use-params'?: string;

  /**
   * Completely replace the default components with the following components.
   */
  components?: string[];

  /**
   * Define some components as being used before the default components.
   */
  'first-components'?: string[];

  /**
   * Define some components as being used after the default components.
   */
  'last-components'?: string[];

  /**
   * Any other properties specific to a particular request handler.
   */
  [property: string]: ConfigProperty | string | string[];
}

/**
 * Parameters for adding a search component.
 */
export interface AddSearchComponentParams {
  /**
   * The name of the search component.
   */
  name: string;

  /**
   * The class to use for the search component.
   */
  class: string;

  /**
   * The param set to use from `params.json`.
   */
  'use-params'?: string;

  /**
   * Define some components as being used before the default components.
   */
  'first-components'?: string[];

  /**
   * Define some components as being used after the default components.
   */
  'last-components'?: string[];

  /**
   * Any other properties specific to a particular search component.
   */
  [component: string]: ConfigProperty | ConfigProperty[] | string | string[];
}

/**
 * The parameters for a bulk config request.
 */
export interface BulkConfigRequestParams {
  'set-property'?: ConfigProperty | ConfigProperty[];
  'unset-property'?: string | string[];
  'set-user-property'?: ConfigProperty | ConfigProperty[];
  'unset-user-property'?: string | string[];
  'add-requesthandler'?: AddRequestHandlerParams | AddRequestHandlerParams[];
  'update-requesthandler'?: AddRequestHandlerParams | AddRequestHandlerParams[];
  'delete-requesthandler'?: string | string[];
  'add-searchcomponent'?: AddSearchComponentParams | AddSearchComponentParams[];
  'update-searchcomponent'?:
    | AddSearchComponentParams
    | AddSearchComponentParams[];
  'delete-searchcomponent'?: string | string[];
}
