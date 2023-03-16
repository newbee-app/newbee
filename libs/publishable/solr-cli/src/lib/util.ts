import type { BasicAuth, RequestHeader } from './interface';

/**
 * A request header listing `Content-Type` as `application/json`.
 */
export const jsonHeader = { headers: { 'Content-Type': 'application/json' } };

/**
 * A request header listing `Content-Type` as `application/octet-stream`.
 */
export const octetStreamHeader = {
  headers: { 'Content-Type': 'application/octet-stream' },
};

/**
 * Genereates a basic auth header with the given username and password.
 *
 * @param username The username for the auth header.
 * @param password The password for the auth header.
 *
 * @returns The auth portion of the header.
 */
export function basicAuthHeader(username: string, password: string) {
  return { auth: { username, password } };
}

/**
 * Generates the header to use for all Solr cli requests.
 *
 * @param basicAuth The username and password to include with requests, if Solr is being used with basic authenticaton.
 *
 * @returns The request header to use for all Solr cli requests.
 */
export function generateSolrCliHeader(basicAuth?: BasicAuth): RequestHeader {
  return {
    ...jsonHeader,
    ...(basicAuth && basicAuthHeader(basicAuth.username, basicAuth.password)),
  };
}

/**
 * Generates the real-time get API URL for the given collection.
 *
 * @param collectionsApiUrl The base API URL for a given collection.
 * @param collectionName The name of the collection we want to work with.
 *
 * @returns The real-time get API URL for the given collection.
 */
export function realTimeGetUrl(
  collectionsApiUrl: string,
  collectionName: string
): string {
  return `${collectionsApiUrl}/${collectionName}/get`;
}

/**
 * Generates the update handler API URL for the given collection.
 *
 * @param solrUrl The base URL for the Solr instance.
 * @param collectionName The name of the collection we want to work with.
 *
 * @returns The update handler API URL for the given collection.
 */
export function updateUrl(solrUrl: string, collectionName: string): string {
  return `${solrUrl}/solr/${collectionName}/update`;
}

/**
 * Generates the JSON update handler API URL for the given collection.
 *
 * @param solrUrl The base URL for the Solr instance.
 * @param collectionName The name of the collection you want to work with.
 *
 * @returns The JSON update handler API URL for the given collection.
 */
export function updateJsonUrl(solrUrl: string, collectionName: string): string {
  return `${updateUrl(solrUrl, collectionName)}/json`;
}

/**
 * Generates the JSON docs update handler API URL for the given collection.
 *
 * @param solrUrl The base URL for the Solr instance.
 * @param collectionName The name of the collection you want to work with.
 *
 * @returns The JSON docs update handler API URL for the given collection.
 */
export function updateJsonDocsUrl(
  solrUrl: string,
  collectionName: string
): string {
  return `${updateJsonUrl(solrUrl, collectionName)}/docs`;
}

/**
 * Generates the schema API URL for the given collection.
 *
 * @param collectionsApiUrl The base API URL for a collection.
 * @param collectionName The name of the collection you want to work with.
 *
 * @returns The schema API URL for the given collection.
 */
export function schemaUrl(
  collectionsApiUrl: string,
  collectionName: string
): string {
  return `${collectionsApiUrl}/${collectionName}/schema`;
}

/**
 * Generates the config API URL for the given collection.
 *
 * @param collectionsApiUrl The base API URL for a collection.
 * @param collectionName The name of the collection you want to work with.
 *
 * @returns The config API URL for the given collection.
 */
export function configUrl(
  collectionsApiUrl: string,
  collectionName: string
): string {
  return `${collectionsApiUrl}/${collectionName}/config`;
}

/**
 * Generates the config overlay API URL for the given collection.
 *
 * @param collectionsApiUrl The base API URL for a colleciton.
 * @param collectionName The name of the collection you want to work with.
 *
 * @returns The config overlay API URL for the given collection.
 */
export function configOverlayUrl(
  collectionsApiUrl: string,
  collectionName: string
): string {
  return `${configUrl(collectionsApiUrl, collectionName)}/overlay`;
}
