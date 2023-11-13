import axios from 'axios';
import { readFileSync } from 'node:fs';
import { URLSearchParams } from 'node:url';
import type {
  AddCopyFieldParams,
  AddDocParams,
  AddDynamicFieldParams,
  AddFieldParams,
  AddFieldTypeParams,
  AddRequestHandlerParams,
  AddSearchComponentParams,
  AddUserParams,
  BasicAuth,
  BulkConfigRequestParams,
  BulkDocRequestParams,
  BulkSchemaRequestParams,
  ConfigProperty,
  CopyFieldParams,
  CreateCollectionParams,
  CreateConfigsetParams,
  DeleteDocParams,
  DeleteFieldParams,
  ListCollectionsResponse,
  ListConfigsetsResponse,
  QueryParams,
  QueryResponse,
  RealTimeGetByIdResponse,
  RequestHeader,
  RetrieveConfigOverlayResponse,
  RetrieveConfigResponse,
  RetrieveCopyFieldsResponse,
  RetrieveDynamicFieldsResponse,
  RetrieveFieldsResponse,
  RetrieveFieldTypesResponse,
  RetrieveSchemaResponse,
  SolrResponse,
  UpdateDocParams,
  UploadConfigsetParams,
} from './interface';
import {
  configOverlayUrl,
  configUrl,
  generateSolrCliHeader,
  handleAxiosErr,
  octetStreamHeader,
  queryUrl,
  realTimeGetUrl,
  schemaUrl,
  suggestUrl,
  updateJsonDocsUrl,
  updateJsonUrl,
} from './util';

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

  // START: search

  /**
   * Query a given collection.
   *
   * @param collectionName The collection to query.
   * @param params The parameters for the query.
   *
   * @returns The result of the query.
   */
  async query(
    collectionName: string,
    params: QueryParams,
  ): Promise<QueryResponse> {
    try {
      return (
        await axios.post(
          queryUrl(this.solrUrl, collectionName),
          params,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Generate query suggestions for a given collection.
   *
   * @param collectionName The collection to generate suggestions for.
   * @param params The parameters for suggestion generation.
   *
   * @returns The result of the suggestion generation.
   */
  async suggest(
    collectionName: string,
    params: QueryParams,
  ): Promise<QueryResponse> {
    try {
      return (
        await axios.post(
          suggestUrl(this.solrUrl, collectionName),
          params,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  // END: search

  // START: collections

  /**
   * LIST all collections.
   *
   * @returns The status of the request and the names of all of the collections in Solr.
   */
  async listCollections(): Promise<ListCollectionsResponse> {
    try {
      return (await axios.get(this.collectionsApiUrl, this.defaultHeader)).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * CREATE a new collection.
   *
   * @param params All of the parameters for CREATEing a collection.
   *
   * @returns The status of the request and the new core names. If the status is anything other than "success", an error message will explain why the request failed.
   */
  async createCollection(
    params: CreateCollectionParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          this.collectionsApiUrl,
          { create: params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * DELETE an existing collection.
   *
   * @param name The name of the collection to delete.
   * @param async The request ID to track this action, which will be processed asynchronously.
   *
   * @returns The status of the request and the cores that were deleted. If the status is anything other than "success", an error message will explain why the request failed.
   */
  async deleteCollection(name: string, async?: string): Promise<SolrResponse> {
    try {
      return (
        await axios.delete(
          `${this.collectionsApiUrl}/${name}${async ? `?async=${async}` : ''}`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Get a doc from a collection using its ID, which is much quicker than querying.
   *
   * @param collectionName The collection to look in.
   * @param id The doc ID to get.
   *
   * @returns The status of the request and the values for the found doc.
   */
  async realTimeGetById(
    collectionName: string,
    id: string,
  ): Promise<RealTimeGetByIdResponse> {
    try {
      return (
        await axios.get(
          `${realTimeGetUrl(this.collectionsApiUrl, collectionName)}?id=${id}`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Gets docs from a collection using their IDs, which is much quicker than querying.
   *
   * @param collectionName The collection to look in.
   * @param ids The doc IDs to get.
   * @param fq Filter query, specified in `<property>:<value>` format.
   *
   * @returns The status of the request and the values for the found docs.
   */
  async realTimeGetByIds(
    collectionName: string,
    ids: string[],
    fq?: string,
  ): Promise<QueryResponse> {
    try {
      return (
        await axios.get(
          `${realTimeGetUrl(
            this.collectionsApiUrl,
            collectionName,
          )}?ids=${ids.join(',')}${fq ? `&fq=${fq}` : ''}`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  // END: collections

  // START: docs

  /**
   * ADD doc(s) to a collection.
   * Can also be used to do a full replace, if the ID of the doc already exists in the index.
   *
   * @param collectionName The name of the collection to add the docs to.
   * @param params All of the parameters for ADDing doc(s).
   *
   * @returns The status of the request.
   */
  async addDocs(
    collectionName: string,
    params: AddDocParams | AddDocParams[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          updateJsonDocsUrl(this.solrUrl, collectionName),
          params,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * DELETE doc(s) from a collection.
   *
   * @param collectionName The collection to delete from.
   * @param params The parameters for DELETEing doc(s).
   *
   * @returns The status of the request.
   */
  async deleteDocs(
    collectionName: string,
    params: DeleteDocParams | DeleteDocParams[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          updateJsonUrl(this.solrUrl, collectionName),
          { delete: params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Performs an atomic update on doc(s) in the collection.
   *
   * @param collectionName The name of the collection to find the doc in.
   * @param params The parameters for performing an atomic update.
   *
   * @returns The status of the request.
   */
  async updateDocs(
    collectionName: string,
    params: UpdateDocParams | UpdateDocParams[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          updateJsonUrl(this.solrUrl, collectionName),
          Array.isArray(params) ? params : [params],
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Performs a full replace on doc(s) in the collection with optimistic concurrency.
   *
   * @param collectionName The name of the collection to find the doc in.
   * @param params The parameters for performing a full replace.
   *
   * @returns The status of the request.
   */
  async getVersionAndReplaceDocs(
    collectionName: string,
    params: AddDocParams | AddDocParams[],
  ): Promise<SolrResponse> {
    const paramsArray = Array.isArray(params) ? params : [params];
    const ids = paramsArray.map((param) => param.id);
    const res = await this.realTimeGetByIds(collectionName, ids);
    paramsArray.forEach((param, index) => {
      const version = res.response?.docs[index]?._version_ ?? null;
      if (version) {
        param._version_ = version;
      }
    });
    return await this.addDocs(collectionName, paramsArray);
  }

  /**
   * Performs an atomic update on doc(s) in the collection with optimistic concurrency.
   *
   * @param collectionName The name of the collection to find the doc in.
   * @param params The parameters for performing an atomic update.
   *
   * @returns The status of the request.
   */
  async getVersionAndUpdateDocs(
    collectionName: string,
    params: UpdateDocParams | UpdateDocParams[],
  ): Promise<SolrResponse> {
    const paramsArray = Array.isArray(params) ? params : [params];
    const ids = paramsArray.map((param) => param.id);
    const res = await this.realTimeGetByIds(collectionName, ids);
    paramsArray.forEach((param, index) => {
      const version = res.response?.docs[index]?._version_ ?? null;
      if (version) {
        param._version_ = version;
      }
    });
    return await this.updateDocs(collectionName, paramsArray);
  }

  /**
   * Creates a bulk transactional doc request. All operations are carried out in the order in which they're specified. Can add or delete.
   *
   * @param collectionName The name of the collection to make doc requests to.
   * @param params The parameters for the bulk doc request.
   *
   * @returns The status of the request.
   */
  async bulkDocRequest(
    collectionName: string,
    params: BulkDocRequestParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          updateJsonUrl(this.solrUrl, collectionName),
          params,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  // END: docs

  // START: configsets

  /**
   * LIST all configsets.
   *
   * @returns The status of the request and the names of all of the configsets in Solr.
   */
  async listConfigsets(): Promise<ListConfigsetsResponse> {
    try {
      return (await axios.get(this.configsetApiUrl, this.defaultHeader)).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params?: UploadConfigsetParams,
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

    try {
      return (
        await axios.put(
          `${this.configsetApiUrl}/${name}${
            filePath ? `/${filePath}` : ''
          }${queryString}`,
          rawFileBuff,
          {
            ...this.defaultHeader,
            ...octetStreamHeader,
          },
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * CREATE a new configset.
   *
   * @param params All of the parameters for CREATEing a configset.
   *
   * @returns The status of the request.
   */
  async createConfigset(params: CreateConfigsetParams): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          this.configsetApiUrl,
          { create: params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * DELETE an existing configset. Does not remove any collections that were created with the configset.
   *
   * @param name The name of the configset to DELETE.
   *
   * @returns The status of the request.
   */
  async deleteConfigset(name: string): Promise<SolrResponse> {
    try {
      return (
        await axios.delete(
          `${this.configsetApiUrl}/${name}`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    collectionName: string,
  ): Promise<RetrieveConfigResponse> {
    try {
      return (
        await axios.get(
          configUrl(this.collectionsApiUrl, collectionName),
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Retrieves the config overlay for the given collection.
   *
   * @param collectionName The collection to retrieve the config overlay for.
   *
   * @returns The status of the request and the config overlay.
   */
  async retrieveConfigOverlay(
    collectionName: string,
  ): Promise<RetrieveConfigOverlayResponse> {
    try {
      return (
        await axios.get(
          configOverlayUrl(this.collectionsApiUrl, collectionName),
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Sets common properties for the given collection.
   *
   * @param collectionName The collection to set common properties for.
   * @param params The common properties to set.
   *
   * @returns The status of the request.
   */
  async setProperty(
    collectionName: string,
    params: ConfigProperty,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'set-property': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Unsets common properties for the given collection.
   *
   * @param collectionName The collection to unset common properties for.
   * @param properties The common properties to unset.
   *
   * @returns The status of the request.
   */
  async unsetProperty(
    collectionName: string,
    properties: string | string[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'unset-property': properties },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: ConfigProperty,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'set-user-property': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    properties: string | string[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'unset-user-property': properties },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Add request handlers for the given collection.
   *
   * @param collectionName The collection to add a request handler to.
   * @param params The parameters for adding request handlers.
   *
   * @returns The status of the request.
   */
  async addRequestHandler(
    collectionName: string,
    params: AddRequestHandlerParams | AddRequestHandlerParams[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'add-requesthandler': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Update request handlers for the given collection.
   *
   * @param collectionName The collection to update a request handler for.
   * @param params The parameters for updating request handlers.
   *
   * @returns The status of the request.
   */
  async updateRequestHandler(
    collectionName: string,
    params: AddRequestHandlerParams | AddRequestHandlerParams[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'update-requesthandler': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Delete request handlers in the given collection.
   *
   * @param collectionName The collection to delete a request handler in.
   * @param handlers The request handlers to delete.
   *
   * @returns The status of the request.
   */
  async deleteRequestHandler(
    collectionName: string,
    handlers: string | string[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'delete-requesthandler': handlers },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Add search components in the given collection.
   *
   * @param collectionName The collection to add a search component to.
   * @param params The parameters for adding search components.
   *
   * @returns The status of the request.
   */
  async addSearchComponent(
    collectionName: string,
    params: AddSearchComponentParams | AddSearchComponentParams[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'add-searchcomponent': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Update search components in the given collection.
   *
   * @param collectionName The collection to update a search component in.
   * @param params The parameters for updating search components.
   *
   * @returns The status of the request.
   */
  async updateSearchComponent(
    collectionName: string,
    params: AddSearchComponentParams | AddSearchComponentParams[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'update-searchcomponent': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Delete search components in the given collection.
   *
   * @param collectionName The collection to delete a search component in.
   * @param components The parameters for deleting search components.
   *
   * @returns The status of the request.
   */
  async deleteSearchComponent(
    collectionName: string,
    components: string | string[],
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          { 'delete-searchcomponent': components },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Make a bulk config request.
   *
   * @param collectionName The collection to make a bulk config request for.
   * @param params The params for the bulk request.
   *
   * @returns The status of the request.
   */
  async bulkConfigRequest(
    collectionName: string,
    params: BulkConfigRequestParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          configUrl(this.collectionsApiUrl, collectionName),
          params,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    collectionName: string,
  ): Promise<RetrieveSchemaResponse> {
    try {
      return (
        await axios.get(
          schemaUrl(this.collectionsApiUrl, collectionName),
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Retrieve the field types of a collection's schema.
   *
   * @param collectionName The collection to get the field types for.
   *
   * @returns The status of the request and the collection's field types.
   */
  async retrieveFieldTypes(
    collectionName: string,
  ): Promise<RetrieveFieldTypesResponse> {
    try {
      return (
        await axios.get(
          `${schemaUrl(this.collectionsApiUrl, collectionName)}/fieldtypes`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Retrieve the fields of a collection's schema.
   *
   * @param collectionName The collection to get the fields for.
   *
   * @returns The status of the request and the collection's fields.
   */
  async retrieveFields(
    collectionName: string,
  ): Promise<RetrieveFieldsResponse> {
    try {
      return (
        await axios.get(
          `${schemaUrl(this.collectionsApiUrl, collectionName)}/fields`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Retrieve the dynamic fields of a collection's schema.
   *
   * @param collectionName The collection to get the dynamic fields for.
   *
   * @returns The status of the request and the collection's dynamic fields.
   */
  async retrieveDynamicFields(
    collectionName: string,
  ): Promise<RetrieveDynamicFieldsResponse> {
    try {
      return (
        await axios.get(
          `${schemaUrl(this.collectionsApiUrl, collectionName)}/dynamicfields`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Retrieve the copy fields of a collection's schema.
   *
   * @param collectionName The collection to get the copy fields for.
   *
   * @returns The status of the request and the collection's copy fields.
   */
  async retrieveCopyFields(
    collectionName: string,
  ): Promise<RetrieveCopyFieldsResponse> {
    try {
      return (
        await axios.get(
          `${schemaUrl(this.collectionsApiUrl, collectionName)}/copyfields`,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: AddFieldTypeParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'add-field-type': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: DeleteFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'delete-field-type': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: AddFieldTypeParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'replace-field-type': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: AddFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'add-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: DeleteFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'delete-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: AddFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'replace-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: AddDynamicFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'add-dynamic-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: DeleteFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'delete-dynamic-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: AddDynamicFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'replace-dynamic-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: AddCopyFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'add-copy-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    params: CopyFieldParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          { 'delete-copy-field': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * Creates a bulk transactional schema request. All operations are carried out in the order in which they're specified. Can perform all of the operations specified under `SchemaOperation`.
   *
   * @param collectionName The name of the collection to make schema requests to.
   * @param params The parameters for the bulk schema request.
   *
   * @returns The status of the request.
   */
  async bulkSchemaRequest(
    collectionName: string,
    params: BulkSchemaRequestParams,
  ): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          schemaUrl(this.collectionsApiUrl, collectionName),
          params,
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
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
    try {
      return (
        await axios.post(
          this.authApiUrl,
          { 'set-user': params },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  /**
   * DELETEs an existing user in the Solr instance's auth plugin.
   *
   * @param usernames The usernames to delete.
   *
   * @returns The status of the request.
   */
  async deleteUser(usernames: string[]): Promise<SolrResponse> {
    try {
      return (
        await axios.post(
          this.authApiUrl,
          { 'delete-user': usernames },
          this.defaultHeader,
        )
      ).data;
    } catch (err) {
      throw handleAxiosErr(err);
    }
  }

  // END: auth
}
