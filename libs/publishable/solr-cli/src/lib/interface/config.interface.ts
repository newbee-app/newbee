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
    userProps: {
      [props: string]: string;
    };
  };
}

/**
 * Properties that are a part of a config.
 */
export interface ConfigProperty {
  [property: string]: string | boolean | number;
}
