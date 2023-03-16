import { ResponseHeader } from './shared.interface';

/**
 * The response from a LIST collections request.
 */
export interface ListCollectionsResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The names of the collections.
   */
  collections: string[];
}

/**
 * All of the parameters for CREATEing a collection.
 */
export interface CreateCollectionParams {
  /**
   * The name of the collection to be created
   */
  name: string;

  /**
   * The router name that will be used. The router defines how documents will be distributed among the shards. Possible values are `implicit` or `compositeId`.
   *
   * The `implicit` router does not automatically route documents to different shards. Whichever shard you indicate on the indexing request (or within each document) will be used as the destination for those documents.
   *
   * The `compositeId` router hashes the value in the uniqueKey field and looks up that hash in the collection’s clusterstate to determine which shard will receive the document, with the additional ability to manually direct the routing.
   *
   * When using the `implicit` router, the shards parameter is required. When using the `compositeId` router, the numShards parameter is required.
   */
  'router.name'?: 'implicit' | 'compositeId';

  /**
   * The number of shards to be created as part of the collection. This is a required parameter when the `router.name` is `compositeId`.
   */
  numShards?: number;

  /**
   * A comma separated list of shard names, e.g., `shard-x`,`shard-y`,`shard-z`. This is a required parameter when the `router.name` is `implicit`.
   */
  shards?: string;

  /**
   * The number of replicas to be created for each shard.
   *
   * This will create a NRT type of replica. If you want another type of replica, see the `tlogReplicas` and `pullReplicas` parameters below.
   */
  replicationFactor?: number;

  /**
   * The number of NRT (Near-Real-Time) replicas to create for this collection. This type of replica maintains a transaction log and updates its index locally. If you want all of your replicas to be of this type, you can simply use `replicationFactor` instead.
   */
  nrtReplicas?: number;

  /**
   * The number of TLOG replicas to create for this collection. This type of replica maintains a transaction log but only updates its index via replication from a leader.
   */
  tlogReplicas?: number;

  /**
   * The number of PULL replicas to create for this collection. This type of replica does not maintain a transaction log and only updates its index via replication from a leader. This type is not eligible to become a leader and should not be the only type of replicas in the collection.
   */
  pullReplicas?: number;

  /**
   * Allows defining the nodes to spread the new collection across. The format is a comma-separated list of node_names, such as `localhost:8983_solr`,`localhost:8984_solr`,`localhost:8985_solr`.
   *
   * If not provided, the CREATE operation will create shard-replicas spread across all live Solr nodes.
   *
   * Alternatively, use the special value of `EMPTY` to initially create no shard-replica within the new collection and then later use the ADDREPLICA operation to add shard-replicas when and where required.
   */
  nodeSet?: string;

  /**
   * Controls whether or not the shard-replicas created for this collection will be assigned to the nodes specified by the `createNodeSet` in a sequential manner, or if the list of nodes should be shuffled prior to creating individual replicas.
   *
   * A `false` value makes the results of a collection creation predictable and gives more exact control over the location of the individual shard-replicas, but `true` can be a better choice for ensuring replicas are distributed evenly across nodes.
   *
   * This parameter is ignored if `createNodeSet` is not also specified.
   */
  shuffleNodes?: boolean;

  /**
   * Defines the name of the configuration (which must already be stored in ZooKeeper) to use for this collection.
   *
   * If not provided, Solr will use the configuration of `_default` configset to create a new (and mutable) configset named `<collectionName>.AUTOCREATED` and will use it for the new collection. When such a collection is deleted, its autocreated configset will be deleted by default when it is not in use by any other collection.
   */
  config?: string;

  /**
   * If this parameter is specified, the router will look at the value of the field in an input document to compute the hash and identify a shard instead of looking at the uniqueKey field. If the field specified is null in the document, the document will be rejected.
   *
   * Please note that RealTime Get or retrieval by document ID would also require the parameter `_route_` (or `shard.keys`) to avoid a distributed search.
   */
  router?: string;

  /**
   * If `true` the states of individual replicas will be maintained as individual child of the `state.json`.
   */
  perReplicaState?: boolean;

  /**
   * If `true`, the request will complete only when all affected replicas become active. The default is `false`, which means that the API will return the status of the single action, which may be before the new replica is online and active.
   */
  waitForFinalState?: boolean;

  /**
   * When a collection is created additionally an alias can be created that points to this collection. This parameter allows specifying the name of this alias, effectively combining this operation with CREATEALIAS.
   */
  alias?: string;

  /**
   * Request ID to track this action which will be processed asynchronously.
   */
  async?: boolean;

  /**
   * Can also include property.<name>=<value> as an option, which sets the core property `name` to `value`.
   */
  [propertyName: string]: string | number | boolean;
}

/**
 * The response from a real-time get request.
 */
export interface RealTimeGetByIdResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The result doc.
   */
  doc: {
    [docParams: string]: string | number | boolean;
  };
}

export interface RealTimeGetByIdsResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The response object.
   */
  response: {
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
    docs: { [docParams: string]: string | number | boolean }[];
  };
}
