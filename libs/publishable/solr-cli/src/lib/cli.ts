import axios from 'axios';
import { readFileSync } from 'fs';
import { URLSearchParams } from 'url';
import {
  configOverlayUrl,
  configUrl,
  generateSolrCliHeader,
  octetStreamHeader,
  schemaUrl,
  updateJsonDocsUrl,
  updateUrl,
} from './constant';
import type {
  AddCopyFieldParams,
  AddDocsParams,
  AddDynamicFieldParams,
  AddFieldParams,
  AddFieldTypeParams,
  AddUserParams,
  BasicAuth,
  BulkSchemaRequestParams,
  CopyFieldParams,
  CreateCollectionParams,
  CreateConfigsetParams,
  DeleteCollectionParams,
  DeleteDocsParams,
  DeleteFieldParams,
  ListCollectionsResponse,
  ListConfigsetsResponse,
  RequestHeader,
  RetrieveCopyFieldsResponse,
  RetrieveDynamicFieldsResponse,
  RetrieveFieldsResponse,
  RetrieveFieldTypesResponse,
  RetrieveSchemaResponse,
  SolrResponse,
  UploadConfigsetParams,
} from './interface';
import {
  ConfigProperty,
  RetrieveConfigOverlayResponse,
  RetrieveConfigResponse,
} from './interface/config.interface';

/**
 * The information needed to create a new `SolrCli`.
 */
export interface SolrCliOptions {
  /**
   * The base URL for the Solr instance to associate with the CLI.
   *
   * e.g. `http://localhost:8983`
   */
  url: string;

  /**
   * The username and password to include with requests, if you're using Solr with basic authentication.
   */
  basicAuth?: BasicAuth;
}

/**
 * A client for interacting with Solr using their HTTP APIs.
 */
export class SolrCli {
  /**
   * The default header to include with every request.
   */
  readonly defaultHeader: RequestHeader;

  /**
   * The URL associated with Solr.
   */
  readonly solrUrl: string;

  /**
   * The URL for the collections API.
   */
  readonly collectionsApiUrl: string;

  /**
   * The URL for the configset API.
   */
  readonly configsetApiUrl: string;

  /**
   * The URL for the auth API.
   */
  readonly authApiUrl: string;

  constructor(options: SolrCliOptions) {
    this.defaultHeader = generateSolrCliHeader(options.basicAuth);
    this.solrUrl = options.url;
    this.collectionsApiUrl = `${this.solrUrl}/api/collections`;
    this.configsetApiUrl = `${this.solrUrl}/api/cluster/configs`;
    this.authApiUrl = `${this.solrUrl}/api/cluster/security/authentication`;
  }

  // START: collections

  /**
   * LIST all collections.
   *
   * @returns The status of the request and the names of all of the collections in Solr.
   */
  async listCollections(): Promise<ListCollectionsResponse> {
    return (await axios.get(this.collectionsApiUrl, this.defaultHeader)).data;
  }

  /**
   * CREATE a new collection.
   *
   * @param params All of the parameters for CREATEing a collection.
   *
   * @returns The status of the request and the new core names. If the status is anything other than "success", an error message will explain why the request failed.
   */
  async createCollection(
    params: CreateCollectionParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        this.collectionsApiUrl,
        { create: params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * DELETE an existing collection.
   *
   * @param name The name of the collection to delete.
   * @param params All of the parameters for DELETEing a collection.
   *
   * @returns The status of the request and the cores that were deleted. If the status is anything other than "success", an error message will explain why the request failed.
   */
  async deleteCollection(
    name: string,
    params?: DeleteCollectionParams
  ): Promise<SolrResponse> {
    const async = params?.async;
    return (
      await axios.delete(
        `${this.collectionsApiUrl}/${name}${async ? `?async=${async}` : ''}`,
        this.defaultHeader
      )
    ).data;
  }

  // END: collections

  // START: docs

  /**
   * ADD docs to a collection.
   *
   * @param collectionName The name of the collection to add the docs to.
   * @param params All of the parameters for ADDing docs.
   *
   * @returns The status of the request and the document that was added.
   */
  async addDocs(
    collectionName: string,
    params: AddDocsParams
  ): Promise<SolrResponse> {
    const updateHandlerUrl = updateJsonDocsUrl(this.solrUrl, collectionName);
    return (await axios.post(updateHandlerUrl, params, this.defaultHeader))
      .data;
  }

  /**
   * DELETE docs from a collection.
   *
   * @param collectionName The name of the collection to delete from.
   * @param params All of the parameters for DELETEing docs.
   *
   * @returns The status of the request.
   */
  async deleteDocs(
    collectionName: string,
    params: DeleteDocsParams
  ): Promise<SolrResponse> {
    const updateHandlerUrl = updateUrl(this.solrUrl, collectionName);
    return (await axios.post(updateHandlerUrl, params, this.defaultHeader))
      .data;
  }

  // END: docs

  // START: configsets

  /**
   * LIST all configsets.
   *
   * @returns The status of the request and the names of all of the configsets in Solr.
   */
  async listConfigsets(): Promise<ListConfigsetsResponse> {
    return (await axios.get(this.configsetApiUrl, this.defaultHeader)).data;
  }

  /**
   * Upload a configset, which is sent as a zipped file. A single, non-zipped file can also be uploaded with the filePath parameter.
   *
   * @param name The configset to be created when the upload is complete.
   * @param path The path to the file to upload.
   * @param filePath The name of the file, if uploading a single file instead of a zip. e.g. `solrconfig.xml`.
   * @param params The parameters for UPLOADing a configset.
   *
   * @returns The status of the request.
   */
  async uploadConfigset(
    name: string,
    path: string,
    filePath?: string,
    params?: UploadConfigsetParams
  ): Promise<SolrResponse> {
    let stringParams: { [params: string]: string } | null = null;
    if (params) {
      stringParams = {};
      for (const [key, value] of Object.entries(params)) {
        stringParams[key] = `${value}`;
      }
    }

    const rawFileBuff = readFileSync(path);
    const queryString = stringParams
      ? `?${new URLSearchParams(stringParams).toString()}`
      : '';

    return (
      await axios.put(
        `${this.configsetApiUrl}/${name}${
          filePath ? `/${filePath}` : ''
        }${queryString}`,
        rawFileBuff,
        {
          ...this.defaultHeader,
          ...octetStreamHeader,
        }
      )
    ).data;
  }

  /**
   * CREATE a new configset.
   *
   * @param params All of the parameters for CREATEing a configset.
   *
   * @returns The status of the request.
   */
  async createConfigset(params: CreateConfigsetParams): Promise<SolrResponse> {
    return (
      await axios.post(
        this.configsetApiUrl,
        { create: params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * DELETE an existing configset. Does not remove any collections that were created with the configset.
   *
   * @param name The name of the configset to DELETE.
   *
   * @returns The status of the request.
   */
  async deleteConfigset(name: string): Promise<SolrResponse> {
    return (
      await axios.delete(`${this.configsetApiUrl}/${name}`, this.defaultHeader)
    ).data;
  }

  // END: configsets

  // START: configs

  /**
   * Retrieves the config for the given collection.
   *
   * @param collectionName The collection to retrieve the config for.
   *
   * @returns The status of the request and the config.
   */
  async retrieveConfig(
    collectionName: string
  ): Promise<RetrieveConfigResponse> {
    return (
      await axios.get(
        configUrl(this.collectionsApiUrl, collectionName),
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Retrieves the config overlay for the given collection.
   *
   * @param collectionName The collection to retrieve the config overlay for.
   *
   * @returns The status of the request and the config overlay.
   */
  async retrieveConfigOverlay(
    collectionName: string
  ): Promise<RetrieveConfigOverlayResponse> {
    return (
      await axios.get(
        configOverlayUrl(this.collectionsApiUrl, collectionName),
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Set user properties for the given collection.
   *
   * @param collectionName The collection to set the user properties for.
   * @param params The user properties to set.
   *
   * @returns The status of the request.
   */
  async setUserProperty(
    collectionName: string,
    params: ConfigProperty
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        configUrl(this.collectionsApiUrl, collectionName),
        { 'set-user-property': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Unsets user properties for the given collection.
   *
   * @param collectionName The collection to unset the user properties for.
   * @param properties The user properties to unset.
   *
   * @returns The status of the request.
   */
  async unsetUserProperty(
    collectionName: string,
    properties: string[]
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        configUrl(this.collectionsApiUrl, collectionName),
        { 'unset-user-property': properties },
        this.defaultHeader
      )
    ).data;
  }

  // END: configs

  // START: schema

  /**
   * Retrieve a collection's entire schema.
   *
   * @param collectionName The collection to get the schema for.
   *
   * @returns The status of the request and the collection's schema.
   */
  async retrieveSchema(
    collectionName: string
  ): Promise<RetrieveSchemaResponse> {
    return (
      await axios.get(
        schemaUrl(this.collectionsApiUrl, collectionName),
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Retrieve the field types of a collection's schema.
   *
   * @param collectionName The collection to get the field types for.
   *
   * @returns The status of the request and the collection's field types.
   */
  async retrieveFieldTypes(
    collectionName: string
  ): Promise<RetrieveFieldTypesResponse> {
    return (
      await axios.get(
        `${schemaUrl(this.collectionsApiUrl, collectionName)}/fieldtypes`,
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Retrieve the fields of a collection's schema.
   *
   * @param collectionName The collection to get the fields for.
   *
   * @returns The status of the request and the collection's fields.
   */
  async retrieveFields(
    collectionName: string
  ): Promise<RetrieveFieldsResponse> {
    return (
      await axios.get(
        `${schemaUrl(this.collectionsApiUrl, collectionName)}/fields`,
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Retrieve the dynamic fields of a collection's schema.
   *
   * @param collectionName The collection to get the dynamic fields for.
   *
   * @returns The status of the request and the collection's dynamic fields.
   */
  async retrieveDynamicFields(
    collectionName: string
  ): Promise<RetrieveDynamicFieldsResponse> {
    return (
      await axios.get(
        `${schemaUrl(this.collectionsApiUrl, collectionName)}/dynamicfields`,
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Retrieve the copy fields of a collection's schema.
   *
   * @param collectionName The collection to get the copy fields for.
   *
   * @returns The status of the request and the collection's copy fields.
   */
  async retrieveCopyFields(
    collectionName: string
  ): Promise<RetrieveCopyFieldsResponse> {
    return (
      await axios.get(
        `${schemaUrl(this.collectionsApiUrl, collectionName)}/copyfields`,
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Add a field type to a collection's schema.
   *
   * @param collectionName The name of the collection to add a field type to.
   * @param params All of the parameters for adding a field type to a schema.
   *
   * @returns The status of the request.
   */
  async addFieldType(
    collectionName: string,
    params: AddFieldTypeParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'add-field-type': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Deletes a field type from a collection's schema.
   *
   * @param collectionName The name of the collection to delete a field type from.
   * @param params All of the parameters for deleting a field from a schema.
   *
   * @returns The status of the request.
   */
  async deleteFieldType(
    collectionName: string,
    params: DeleteFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'delete-field-type': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Replaces a field type in a collection's schema. Operation is a full replace, not a partial replace.
   *
   * @param collectionName The name of the collection to replace a field type for.
   * @param params All of the parameters for replacing an existing field.
   *
   * @returns The status of the request.
   */
  async replaceFieldType(
    collectionName: string,
    params: AddFieldTypeParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'replace-field-type': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Add a field to a collection's schema.
   *
   * @param collectionName The name of the collection to add a field to.
   * @param params The parameters for adding a field to a schema.
   *
   * @returns The status of the request.
   */
  async addField(
    collectionName: string,
    params: AddFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'add-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Delete a field from a collection's schema.
   *
   * @param collectionName The name of the field to delete a field from.
   * @param params The parameters for deleting a field from a schema.
   *
   * @returns The status of the request.
   */
  async deleteField(
    collectionName: string,
    params: DeleteFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'delete-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Replaces a field in a collection's schema. Operation is a full replace, not a partial replace.
   *
   * @param collectionName The name of the collection to replace a field for.
   * @param params The parameters for replacing a field in a schema.
   *
   * @returns The status of the request.
   */
  async replaceField(
    collectionName: string,
    params: AddFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'replace-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Add a dynamic field to a collection's schema.
   *
   * @param collectionName The name of the collection to add a dynamic field to.
   * @param params The parameters for adding a dynamic field.
   *
   * @returns The status of the request.
   */
  async addDynamicField(
    collectionName: string,
    params: AddDynamicFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'add-dynamic-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Deletes a dynamic field from a collection's schema.
   *
   * @param collectionName The name of the collection to delete a dynamic field from.
   * @param params The parameters for deleting a dynamic field.
   *
   * @returns The status of the request.
   */
  async deleteDynamicField(
    collectionName: string,
    params: DeleteFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'delete-dynamic-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Replace a dynamic field in a collection's schema. Operation is a full replace, not a partial replace.
   *
   * @param collectionName The name of the collection to replace a dynamic field in.
   * @param params The parameters for replacing a dynamic field.
   *
   * @returns The status of the request.
   */
  async replaceDynamicField(
    collectionName: string,
    params: AddDynamicFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'replace-dynamic-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Add a copy field to a collection's schema.
   *
   * @param collectionName The name of the collection to add a copy field to.
   * @param params The parameters for adding a copy field.
   *
   * @returns The status of the request.
   */
  async addCopyField(
    collectionName: string,
    params: AddCopyFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'add-copy-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Delete a copy field from a collection's schema.
   *
   * @param collectionName The name of the collection to delete a copy field from.
   * @param params The parameters for deleting a copy field.
   *
   * @returns The status of the request.
   */
  async deleteCopyField(
    collectionName: string,
    params: CopyFieldParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        { 'delete-copy-field': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * Creates a bulk transactional schema request. All operations are carried out in the order in which they're specified. Can perform all of the operations specified under `SchemaOperation`.
   *
   * @param collectionName The name of the collection to make schema requests to.
   * @param params The parameters for the bulk schema request.
   * @returns
   */
  async bulkSchemaRequest(
    collectionName: string,
    params: BulkSchemaRequestParams
  ): Promise<SolrResponse> {
    return (
      await axios.post(
        schemaUrl(this.collectionsApiUrl, collectionName),
        params,
        this.defaultHeader
      )
    ).data;
  }

  // END: schema

  // START: auth

  /**
   * ADDs a new user or edits an existing user's password in the Solr instance's auth plugin.
   *
   * @param params The parameters for adding new users to the auth plugin.
   *
   * @returns The status of the request.
   */
  async addUserEditPassword(params: AddUserParams): Promise<SolrResponse> {
    return (
      await axios.post(
        this.authApiUrl,
        { 'set-user': params },
        this.defaultHeader
      )
    ).data;
  }

  /**
   * DELETEs an existing user in the Solr instance's auth plugin.
   *
   * @param usernames The usernames to delete.
   *
   * @returns The status of the request.
   */
  async deleteUser(usernames: string[]): Promise<SolrResponse> {
    return (
      await axios.post(
        this.authApiUrl,
        { 'delete-user': usernames },
        this.defaultHeader
      )
    ).data;
  }

  // END: auth
}
