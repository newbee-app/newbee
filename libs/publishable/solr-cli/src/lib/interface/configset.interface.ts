import { ResponseHeader } from './shared.interface';

/**
 * The response from a LIST configsets request.
 */
export interface ListConfigsetsResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The names of the configsets.
   */
  configSets: string[];
}

/**
 * All of the parameters for UPLOADing a configset.
 */
export interface UploadConfigsetParams {
  /**
   * If set to `true`, Solr will overwrite an existing configset with the same name (if false, the request will fail). If `filePath` is provided, then this option specifies whether the specified file within the configset should be overwritten if it already exists. Default is false when using the v1 API, but `true` when using the v2 API.
   */
  overwrite?: boolean;

  /**
   * When overwriting an existing configset (`overwrite=true`), this parameter tells Solr to delete the files in ZooKeeper that existed in the old configset but not in the one being uploaded. This parameter cannot be set to true when `filePath` is used.
   */
  cleanup?: boolean;
}

/**
 * All of the parameters for CREATEing a configset.
 */
export interface CreateConfigsetParams {
  /**
   * The configset to be created.
   */
  name: string;

  /**
   * The name of the configset to copy as a base.
   */
  baseConfigSet?: string;

  /**
   * Configset properties from the base configset to override in the copied configset.
   */
  properties?: {
    [configSetProp: string]: string;
  };
}
