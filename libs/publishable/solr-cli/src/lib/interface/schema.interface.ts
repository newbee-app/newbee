import type { ResponseHeader } from './shared.interface';

/**
 * The parameters for a bulk schema request.
 */
export interface BulkSchemaRequestParams {
  'add-field'?: AddFieldParams | AddFieldParams[];
  'delete-field'?: DeleteFieldParams | DeleteFieldParams[];
  'replace-field'?: AddFieldParams | AddFieldParams[];
  'add-dynamic-field'?: AddDynamicFieldParams | AddDynamicFieldParams[];
  'delete-dynamic-field'?: DeleteFieldParams | DeleteFieldParams[];
  'replace-dynamic-field'?: AddDynamicFieldParams | AddDynamicFieldParams[];
  'add-field-type'?: AddFieldTypeParams | AddFieldTypeParams[];
  'delete-field-type'?: DeleteFieldParams | DeleteFieldParams[];
  'replace-field-type'?: AddFieldTypeParams | AddFieldTypeParams[];
  'add-copy-field'?: AddCopyFieldParams | AddCopyFieldParams[];
  'delete-copy-field'?: CopyFieldParams | CopyFieldParams[];
}

/**
 * How field types are structured in a response.
 */
export interface FieldType {
  /**
   * The name of the field type.
   */
  name: string;

  /**
   * The Java class associated with the field type.
   */
  class: string;

  /**
   * The field type's additional properties.
   */
  [property: string]: string | number | boolean;
}

/**
 * How fields are structured in a response.
 */
export interface Field {
  /**
   * The name of the field.
   */
  name: string;

  /**
   * The field type associated with the field.
   */
  type: string;

  /**
   * The field's additional properties.
   */
  [property: string]: string | number | boolean;
}

/**
 * How dyanmic fields are structured in a response.
 */
export interface DynamicField {
  /**
   * The name of the dynamic field.
   */
  name: string;

  /**
   * The field type associated with the dynamic field.
   */
  type: string;

  /**
   * The dynamic field's additional properties.
   */
  [property: string]: string | number | boolean;
}

/**
 * How copy fields are structured in a response.
 */
export interface CopyField {
  /**
   * Where to direct the copy to.
   */
  dest: string;

  /**
   * Where to copy from.
   */
  source: string;
}

/**
 * The response for a retrieve schema request.
 */
export interface RetrieveSchemaResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The schema.
   */
  schema: {
    /**
     * The name of the schema.
     */
    name: string;

    /**
     * The version of the schema.
     */
    version: number;

    /**
     * The field that acts as the unique key in the schema.
     */
    uniqueKey: string;

    /**
     * The field types of the schema.
     */
    fieldTypes: FieldType[];

    /**
     * The fields of the schema.
     */
    fields: Field[];

    /**
     * The dynamic fields of the schema.
     */
    dynamicFields: DynamicField[];

    /**
     * The copy fields of the schema.
     */
    copyFields: CopyField[];
  };
}

/**
 * The response for a retrieve schema request.
 */
export interface RetrieveSchemaResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The schema.
   */
  schema: {
    /**
     * The name of the schema.
     */
    name: string;

    /**
     * The version of the schema.
     */
    version: number;

    /**
     * The field that acts as the unique key in the schema.
     */
    uniqueKey: string;

    /**
     * The field types of the schema.
     */
    fieldTypes: FieldType[];

    /**
     * The fields of the schema.
     */
    fields: Field[];

    /**
     * The dynamic fields of the schema.
     */
    dynamicFields: DynamicField[];

    /**
     * The copy fields of the schema.
     */
    copyFields: CopyField[];
  };
}

/**
 * The response for a retrieve field types request.
 */
export interface RetrieveFieldTypesResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The field types of the schema.
   */
  fieldTypes: FieldType[];
}

/**
 * The response for a retrieve fields request.
 */
export interface RetrieveFieldsResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The fields of the schema.
   */
  fields: Field[];
}

/**
 * The response for a retrieve dynamic fields request.
 */
export interface RetrieveDynamicFieldsResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The dynamic fields of the schema.
   */
  dynamicFields: DynamicField[];
}

/**
 * The response for a retrieve copy fields request.
 */
export interface RetrieveCopyFieldsResponse {
  /**
   * The response header.
   */
  responseHeader: ResponseHeader;

  /**
   * The copy fields of the schema.
   */
  copyFields: CopyField[];
}

/**
 * All of the properties needed to define a field analyzer.
 */
export interface Analyzer {
  /**
   * The tokenizer to associate with the analyzer.
   */
  tokenizer: {
    name: string;
    [tokenizerOptions: string]: string;
  };

  /**
   * The filters to associate with the analyzer.
   */
  filters?: {
    name: string;
    [filterOptions: string]: string;
  }[];

  /**
   * The char filters to associate with the analyzer.
   */
  charFilters?: {
    name: string;
    [charFilterOptions: string]: string;
  }[];
}

/**
 * Properties shared between fields and field types.
 */
export interface FieldDefaultProperties {
  /**
   * If `true`, the value of the field can be used in queries to retrieve matching documents.
   */
  indexed?: boolean;

  /**
   * If `true`, the actual value of the field can be retrieved by queries.
   */
  stored?: boolean;

  /**
   * If `true`, the value of the field will be put in a column-oriented DocValues structure.
   */
  docValues?: boolean;

  /**
   * Control the placement of documents when a sort field is not present.
   */
  sortMissingFirst?: boolean;

  /**
   * Control the placement of documents when a sort field is not present.
   */
  sortMissingLast?: boolean;

  /**
   * If `true`, indicates that a single document might contain multiple values for this field type.
   */
  multiValued?: boolean;

  /**
   * If `true`, indicates that an `indexed="true"` `docValues="false"` field can be "un-inverted" at query time to build up large in memory data structure to serve in place of DocValues. Defaults to `true` for historical reasons, but users are strongly encouraged to set this to `false` for stability and use `docValues="true"` as needed.
   */
  uninvertible?: boolean;

  /**
   * If `true`, omits the norms associated with this field (this disables length normalization for the field, and saves some memory). Defaults to true for all primitive (non-analyzed) field types, such as int, float, data, bool, and string. Only full-text fields or fields need norms.
   */
  omitNorms?: boolean;

  /**
   * If `true`, omits term frequency, positions, and payloads from postings for this field. This can be a performance boost for fields that don’t require that information. It also reduces the storage space required for the index. Queries that rely on position that are issued on a field with this option will silently fail to find documents. This property defaults to true for all field types that are not text fields.
   */
  omitTermFreqAndPositions?: boolean;

  /**
   * Similar to `omitTermFreqAndPositions` but preserves term frequency information.
   */
  omitPositions?: boolean;

  /**
   * These options instruct Solr to maintain full term vectors for each document, optionally including position, offset, and payload information for each term occurrence in those vectors. These can be used to accelerate highlighting and other ancillary functionality, but impose a substantial cost in terms of index size. They are not necessary for typical uses of Solr.
   */
  termVectors?: boolean;

  /**
   * These options instruct Solr to maintain full term vectors for each document, optionally including position, offset, and payload information for each term occurrence in those vectors. These can be used to accelerate highlighting and other ancillary functionality, but impose a substantial cost in terms of index size. They are not necessary for typical uses of Solr.
   */
  termPositions?: boolean;

  /**
   * These options instruct Solr to maintain full term vectors for each document, optionally including position, offset, and payload information for each term occurrence in those vectors. These can be used to accelerate highlighting and other ancillary functionality, but impose a substantial cost in terms of index size. They are not necessary for typical uses of Solr.
   */
  termOffsets?: boolean;

  /**
   * These options instruct Solr to maintain full term vectors for each document, optionally including position, offset, and payload information for each term occurrence in those vectors. These can be used to accelerate highlighting and other ancillary functionality, but impose a substantial cost in terms of index size. They are not necessary for typical uses of Solr.
   */
  termPayloads?: boolean;

  /**
   * Instructs Solr to reject any attempts to add a document which does not have a value for this field. This property defaults to `false`.
   */
  required?: boolean;

  /**
   * If the field has DocValues enabled, setting this to true would allow the field to be returned as if it were a stored field (even if it has `stored=false`) when matching “*” in an fl parameter.

   */
  useDocValuesAsStored?: boolean;

  /**
   * Large fields are always lazy loaded and will only take up space in the document cache if the actual value is < 512KB. This option requires `stored="true"` and `multiValued="false"`. It’s intended for fields that might have very large values so that they don’t get cached in memory.
   */
  large?: boolean;
}

/**
 * All of the parameters for adding a new field type to a schema.
 */
export interface AddFieldTypeParams extends FieldDefaultProperties {
  /**
   * The name of the fieldType. This value gets used in field definitions, in the "type" attribute. It is strongly recommended that names consist of alphanumeric or underscore characters only and not start with a digit. This is not currently strictly enforced.
   */
  name: string;

  /**
   * The class name used to store and index the data for this type. Note that you may prefix included class names with "solr." and Solr will automatically figure out which packages to search for the class - so `solr.TextField` will work.
   *
   * If you are using a third-party class, you will probably need to have a fully qualified class name. The fully qualified equivalent for `solr.TextField` is `org.apache.solr.schema.TextField`.
   */
  class: string;

  /**
   * For multivalued fields, specifies a distance between multiple values, which prevents spurious phrase matches.
   */
  positionIncrementGap?: number;

  /**
   * For text fields. If `true`, Solr automatically generates phrase queries for adjacent terms. If `false`, terms must be enclosed in double-quotes to be treated as phrases.
   */
  autoGeneratePhraseQueries?: boolean;

  /**
   * Query used to combine scores of overlapping query terms (i.e., synonyms). Consider a search for "blue tee" with query-time synonyms `tshirt,tee`.
   *
   * - `as_same_term`: Blends terms, i.e., `SynonymQuery(tshirt,tee)` where each term will be treated as equally important. This option is appropriate when terms are true synonyms (e.g., "television, tv").
   * - `pick_best`: Selects the most significant synonym when scoring `Dismax(tee,tshirt)`. Use this when synonyms are expanding to hyponyms `(q=jeans w/ jeans⇒jeans,pants)` and you want exact to come before parent and sibling concepts.
   * - `as_distinct_terms`: Biases scoring towards the most significant synonym (pants OR slacks).
   */
  synonymQueryStyle?: string;

  /**
   * For text fields, applicable when querying with `sow=false` (the default). Use `true` for field types with query analyzers including graph-aware filters, e.g., Synonym Graph Filter and Word Delimiter Graph Filter.
   *
   * Use `false` for field types with query analyzers including filters that can match docs when some tokens are missing, e.g., Shingle Filter.
   */
  enableGraphQueries?: boolean;

  /**
   * Defines a custom `DocValuesFormat` to use for fields of this type. This requires that a schema-aware codec, such as the `SchemaCodecFactory`, has been configured in `solrconfig.xml`.
   */
  docValuesFormat?: string;

  /**
   * Defines a custom `PostingsFormat` to use for fields of this type. This requires that a schema-aware codec, such as the `SchemaCodecFactory`, has been configured in `solrconfig.xml`.
   */
  postingsFormat?: string;

  /**
   * A single analyzer for when we want to use one analyzer for index and query analysis. Mutually exclusive with `indexAnalyzer` and `queryAnalyzer`.
   */
  analyzer?: Analyzer;

  /**
   * The analyzer to use for index analysis. Need to include a `queryAnalyzer` if this property is specified.
   */
  indexAnalyzer?: Analyzer;

  /**
   * The analyzer to use for query analysis. Need to include an `indexAnalyzer` if this property is specified.
   */
  queryAnalyzer?: Analyzer;

  /**
   * Any additional properties needed to create a field type.
   */
  [property: string]: string | boolean | number | Analyzer;
}

/**
 * The parameters for adding a new field to a schema.
 */
export interface AddFieldParams extends FieldDefaultProperties {
  /**
   * The name of the field. Field names should consist of alphanumeric or underscore characters only and not start with a digit. This is not currently strictly enforced, but other field names will not have first class support from all components and back compatibility is not guaranteed. Names with both leading and trailing underscores (e.g., `_version_`) are reserved.
   */
  name: string;

  /**
   * The name of the `fieldType` for this field. This will be found in the `name` attribute on the `fieldType` definition. Every field must have a `type`.
   */
  type: string;

  /**
   * A default value that will be added automatically to any document that does not have a value in this field when it is indexed. If this property is not specified, there is no default.
   */
  default?: string | number | boolean;
}

/**
 * The parameters for deleting a field, field type, or dynamic field from a schema.
 */
export interface DeleteFieldParams {
  /**
   * Name of the field, field type, or dynamic field to delete.
   */
  name: string;
}

/**
 * The parameters for adding a dynamic field to a schema.
 */
export interface AddDynamicFieldParams extends FieldDefaultProperties {
  /**
   * The name of the dynamic field. Should include a wildcard character (`*`).
   */
  name: string;

  /**
   * The field type for the dynamic field.
   */
  type: string;
}

/**
 * The parameters for adding or deleting a copy field to a schema.
 */
export interface CopyFieldParams {
  /**
   * The source field.
   */
  source: string;

  /**
   * A field or an array of fields to which the source field will be copied.
   */
  dest: string | string[];
}

/**
 * The parameters for adding a new copy field to a schema.
 */
export interface AddCopyFieldParams extends CopyFieldParams {
  /**
   * The upper limit for the number of characters to be copied.
   */
  maxChars?: number;
}
