// Creates the base Solr configset that will be used by NewBee to store an organization's docs and qnas

import {
  solrAppCollection,
  solrAppConfigset,
  solrAppDictionaries,
  solrAppFields,
  solrOrgConfigset,
  solrOrgDefaultHighlightedFields,
  solrOrgDictionaries,
  solrOrgFields,
} from '@newbee/api/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import type { OptionValues } from 'commander';
import { Command } from 'commander';
import { execute, prettyJson } from '../util';

/**
 * The main body of the script
 */
async function main(): Promise<void> {
  const program = new Command();

  program
    .name('configset')
    .description(
      'A utility script for working with configsets and setting them up for use by NewBee.',
    )
    .version('1.0.0');

  program
    .command('create')
    .description(
      'Creates the new configsets from scratch, without using uploads',
    )
    .option(
      '-u, --url <url>',
      'The URL associated with the Solr instance',
      'http://127.0.0.1:8983',
    )
    .option(
      '-b, --basic-auth <basic-auth>',
      'The username and password to attach to the basic auth portion of request headers (in username:password format)',
    )
    .action(create);

  program
    .command('delete <configset>')
    .description('Deletes the given configset')
    .option(
      '-u, --url <url>',
      'The URL associated with the Solr instance',
      'http://127.0.0.1:8983',
    )
    .option(
      '-b, --basic-auth <basic-auth>',
      'The username and password to attach to the basic auth portion of request headers (in username:password format)',
    )
    .action(deleteConfigset);

  program
    .command('download <configset> <destination>')
    .description('Download the given configset from Solr')
    .option(
      '-z, --zookeeper <zookeeper>',
      `The location of Solr's Zookeeper instance`,
      'localhost:2181',
    )
    .action(download);

  program
    .command('upload <configset> <path>')
    .description('Uploads an existing configset')
    .option(
      '-u, --url <url>',
      'The URL associated with the Solr instance',
      'http://127.0.0.1:8983',
    )
    .option(
      '-b, --basic-auth <basic-auth>',
      'The username and password to attach to the basic auth portion of request headers (in username:password format)',
    )
    .action(upload);

  program
    .command('zip <path> <destination>')
    .description(
      'Zip a configset located on the local filepath to get it ready to be uploaded',
    )
    .action(zip);

  await program.parseAsync(process.argv);
}

/**
 * Create configsets from scratch, without uploading anything.
 *
 * @param options The CLI options for creating a SolrCli instance.
 */
async function create(options: OptionValues): Promise<void> {
  // START: Create all of the constants I'll reuse in the method to avoid typos

  // Related to outside files
  const orgEnumsConfigXml = 'orgEnumsConfig.xml';
  const appEnumsConfigXml = 'appEnumsConfig.xml';

  // Related to field types
  const solrEnumFieldType = 'solr.EnumFieldType';
  const orgEntryEnumName = 'org_entry';
  const appEntryEnumName = 'app_entry';
  const orgRoleType = 'org_role_type';
  const appRoleType = 'app_role_type';
  const orgRoleEnumName = 'org_role';
  const appRoleEnumName = 'app_role';
  const basicText = 'basic_text';
  const solrTextField = 'solr.TextField';
  const standard = 'standard';
  const lowercase = 'lowercase';
  const edgeNGramText = 'edge_n_gram_text';
  const stringFieldType = 'string';
  const pdate = 'pdate';
  const textGeneral = 'text_general';
  const booleanFieldType = 'boolean';

  // Related to fields
  const textField = '_text_';
  const spellcheckAll = '_spellcheck_all_';
  const spellcheckDoc = '_spellcheck_doc_';
  const spellcheckQna = '_spellcheck_qna_';
  const spellcheckTeam = '_spellcheck_team_';
  const spellcheckUser = '_spellcheck_user_';
  const spellcheckWaitlist = '_spellcheck_waitlist_';
  const suggestAll = 'suggest_all';
  const suggestDoc = 'suggest_doc';
  const suggestQna = 'suggest_qna';
  const suggestTeam = 'suggest_team';
  const suggestUser = 'suggest_user';
  const suggestWaitlist = 'suggest_waitlist';
  const commonCopyFields = [textField, spellcheckAll];
  const suggestCopyFields = [...commonCopyFields, suggestAll];

  // Related to request handlers
  const suggest = 'suggest';
  const solrSuggestComponent = 'solr.SuggestComponent';
  const commonSuggestParams = {
    lookupImpl: 'BlendedInfixLookupFactory',
    dictionaryImpl: 'DocumentDictionaryFactory',
    suggestAnalyzerFieldType: basicText,
  };
  const orgSuggestParams = {
    ...commonSuggestParams,
    contextField: solrOrgFields.out_of_date_at,
  };
  const spellcheck = 'spellcheck';
  const solrSpellcheckComponent = 'solr.SpellCheckComponent';
  const spellcheckParams = {
    classname: 'solr.DirectSolrSpellChecker',
    distanceMeasure: 'internal',
    accuracy: 0.5,
    maxEdits: 2,
    minPrefix: 1,
    maxInspections: 5,
    minQueryLength: 4,
    maxQueryFrequency: 0.01,
  };
  const query = 'query';
  const solrSearchHandler = 'solr.SearchHandler';
  const queryDefaults = {
    wt: 'json',
    indent: 'true',
    defType: 'edismax',
    qf: textField,
    spellcheck: 'true',
    'spellcheck.count': '1',
    'spellcheck.alternativeTermCount': '5',
    'spellcheck.extendedResults': 'true',
    'spellcheck.collate': 'true',
    'spellcheck.maxCollations': '1',
    'spellcheck.maxCollationTries': '10',
    'spellcheck.collateExtendedResults': 'true',
    'spellcheck.maxResultsForSuggest': '3',
  };
  const suggestDefaults = {
    suggest: 'true',
    'suggest.count': '10',
  };

  // END: Create all of the constants I'll reuse in the method to avoid typos

  const solrCli = createSolrCli(options);

  // Check if the configsets we want to create already exist
  const configsets = new Set((await solrCli.listConfigsets()).configSets);
  if (configsets.has(solrOrgConfigset)) {
    const res = await solrCli.deleteConfigset(solrOrgConfigset);
    console.log(
      `Deleted existing ${solrOrgConfigset} configset: ${prettyJson(res)}`,
    );
  }
  if (configsets.has(solrAppConfigset)) {
    const res = await solrCli.deleteConfigset(solrAppConfigset);
    console.log(
      `Deleted existing ${solrAppConfigset} configset: ${prettyJson(res)}`,
    );
  }

  // Create the configsets
  let res = await solrCli.createConfigset({ name: solrOrgConfigset });
  console.log(`Created configset ${solrOrgConfigset}: ${prettyJson(res)}`);
  res = await solrCli.createConfigset({ name: solrAppConfigset });
  console.log(`Created configset ${solrAppConfigset}: ${prettyJson(res)}`);

  // Upload config files to the configsets
  res = await solrCli.uploadConfigset(
    solrOrgConfigset,
    orgEnumsConfigXml,
    orgEnumsConfigXml,
  );
  console.log(`Uploaded ${orgEnumsConfigXml} to configset: ${prettyJson(res)}`);
  res = await solrCli.uploadConfigset(
    solrAppConfigset,
    appEnumsConfigXml,
    appEnumsConfigXml,
  );
  console.log(`Uploaded ${appEnumsConfigXml} to configset: ${prettyJson(res)}`);

  // Check if the collections we want to create already exist
  const collections = new Set((await solrCli.listCollections()).collections);
  if (collections.has(solrOrgConfigset)) {
    res = await solrCli.deleteCollection(solrOrgConfigset);
    console.log(
      `Deleted existing ${solrOrgConfigset} collection: ${prettyJson(res)}`,
    );
  }
  if (collections.has(solrAppCollection)) {
    res = await solrCli.deleteCollection(solrAppCollection);
    console.log(
      `Deleted existing ${solrAppCollection} collection: ${prettyJson(res)}`,
    );
  }

  // Create a temporary org collection that uses the org configset to allow us to make changes to it
  res = await solrCli.createCollection({
    name: solrOrgConfigset,
    numShards: 1,
    config: solrOrgConfigset,
  });
  console.log(
    `Created temporary collection ${solrOrgConfigset}: ${prettyJson(res)}`,
  );

  // Create the collection for the app configset
  res = await solrCli.createCollection({
    name: solrAppCollection,
    numShards: 1,
    config: solrAppConfigset,
  });
  console.log(`Created collection ${solrAppCollection}: ${prettyJson(res)}`);

  // Make a bulk request to set up the org schema
  res = await solrCli.bulkSchemaRequest(solrOrgConfigset, {
    // Create all of the needed field types
    'add-field-type': [
      // An enum describing the type of the entry
      {
        name: solrOrgFields.entry_type,
        class: solrEnumFieldType,
        enumsConfig: orgEnumsConfigXml,
        enumName: orgEntryEnumName,
        docValues: true,
      },

      // An enum describing possible roles for org members
      {
        name: orgRoleType,
        class: solrEnumFieldType,
        enumsConfig: orgEnumsConfigXml,
        enumName: orgRoleEnumName,
        docValues: true,
      },

      // A basic text field with minimal analysis done on it
      {
        name: basicText,
        class: solrTextField,
        positionIncrementGap: 100,
        analyzer: {
          tokenizer: { name: standard },
          filters: [{ name: lowercase }],
        },
      },

      // An extension of the basic text field type that also applies an edge n-gram filter of size 2-10 for the index analyzer
      {
        name: edgeNGramText,
        class: solrTextField,
        positionIncrementGap: 100,
        indexAnalyzer: {
          tokenizer: { name: standard },
          filters: [
            { name: lowercase },
            {
              name: 'edgeNGram',
              minGramSize: '2',
              maxGramSize: '10',
              preserveOriginal: 'true',
            },
          ],
        },
        queryAnalyzer: {
          tokenizer: { name: standard },
          filters: [{ name: lowercase }],
        },
      },
    ],

    // Create all of the needed fields
    'add-field': [
      // Required for spellchecking
      {
        name: spellcheckAll,
        type: basicText,
        multiValued: true,
        stored: false,
      },
      {
        name: spellcheckDoc,
        type: basicText,
        multiValued: true,
        stored: false,
      },
      {
        name: spellcheckQna,
        type: basicText,
        multiValued: true,
        stored: false,
      },
      {
        name: spellcheckTeam,
        type: basicText,
        multiValued: true,
        stored: false,
      },
      {
        name: spellcheckUser,
        type: basicText,
        multiValued: true,
        stored: false,
      },

      // Required for auto-complete suggestions
      {
        name: suggestAll,
        type: basicText,
        multiValued: true,
        stored: true,
      },
      {
        name: suggestDoc,
        type: basicText,
        multiValued: true,
        stored: true,
      },
      {
        name: suggestQna,
        type: basicText,
        multiValued: true,
        stored: true,
      },
      {
        name: suggestTeam,
        type: basicText,
        multiValued: true,
        stored: true,
      },
      {
        name: suggestUser,
        type: basicText,
        multiValued: true,
        stored: true,
      },

      // Required on all entries to distinguish them
      {
        name: solrOrgFields.entry_type,
        type: solrOrgFields.entry_type,
        required: true,
      },

      // Applicable for all entries
      { name: solrOrgFields.slug, type: stringFieldType, required: true },
      { name: solrOrgFields.created_at, type: pdate, required: true },
      { name: solrOrgFields.updated_at, type: pdate, required: true },

      // Applicable for user
      { name: solrOrgFields.user_email, type: stringFieldType },
      { name: solrOrgFields.user_name, type: textGeneral, multiValued: false },
      {
        name: solrOrgFields.user_display_name,
        type: textGeneral,
        multiValued: false,
      },
      { name: solrOrgFields.user_phone_number, type: stringFieldType },
      { name: solrOrgFields.user_org_role, type: orgRoleType },

      // Applicable for team
      { name: solrOrgFields.team_name, type: textGeneral, multiValued: false },

      // Applicable for doc and qna
      { name: solrOrgFields.team_id, type: stringFieldType },
      { name: solrOrgFields.marked_up_to_date_at, type: pdate },
      { name: solrOrgFields.out_of_date_at, type: pdate },
      { name: solrOrgFields.creator_id, type: stringFieldType },
      { name: solrOrgFields.maintainer_id, type: stringFieldType },

      // Applicable for doc
      { name: solrOrgFields.doc_title, type: textGeneral, multiValued: false },
      { name: solrOrgFields.doc_txt, type: textGeneral, multiValued: false },

      // Applicable for qna
      { name: solrOrgFields.qna_title, type: textGeneral, multiValued: false },
      {
        name: solrOrgFields.question_txt,
        type: textGeneral,
        multiValued: false,
      },
      { name: solrOrgFields.answer_txt, type: textGeneral, multiValued: false },
    ],

    // Create all of the needed copy fields
    'add-copy-field': [
      {
        source: solrOrgFields.user_email,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrOrgFields.user_name,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrOrgFields.user_display_name,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrOrgFields.user_phone_number,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrOrgFields.team_name,
        dest: [...suggestCopyFields, spellcheckTeam, suggestTeam],
      },
      {
        source: solrOrgFields.doc_title,
        dest: [...suggestCopyFields, spellcheckDoc, suggestDoc],
      },
      {
        source: solrOrgFields.doc_txt,
        dest: [...commonCopyFields, spellcheckDoc],
      },
      {
        source: solrOrgFields.qna_title,
        dest: [...suggestCopyFields, spellcheckQna, suggestQna],
      },
      {
        source: solrOrgFields.question_txt,
        dest: [...commonCopyFields, spellcheckQna],
      },
      {
        source: solrOrgFields.answer_txt,
        dest: [...commonCopyFields, spellcheckQna],
      },
    ],
  });
  console.log(`Created org schema with bulk request: ${prettyJson(res)}`);

  // Make a bulk request to set up the app schema
  res = await solrCli.bulkSchemaRequest(solrAppCollection, {
    // Create all of the needed field types
    'add-field-type': [
      // An enum describing the type of the entry
      {
        name: solrAppFields.entry_type,
        class: solrEnumFieldType,
        enumsConfig: appEnumsConfigXml,
        enumName: appEntryEnumName,
        docValues: true,
      },

      // An enum describing possible roles for org members
      {
        name: appRoleType,
        class: solrEnumFieldType,
        enumsConfig: appEnumsConfigXml,
        enumName: appRoleEnumName,
        docValues: true,
      },

      // A basic text field with minimal analysis done on it
      {
        name: basicText,
        class: solrTextField,
        positionIncrementGap: 100,
        analyzer: {
          tokenizer: { name: standard },
          filters: [{ name: lowercase }],
        },
      },
    ],

    // Create all of the needed fields
    'add-field': [
      // Required for spellchecking
      {
        name: spellcheckAll,
        type: basicText,
        multiValued: true,
        stored: false,
      },
      {
        name: spellcheckUser,
        type: basicText,
        multiValued: true,
        stored: false,
      },
      {
        name: spellcheckWaitlist,
        type: basicText,
        multiValued: true,
        stored: false,
      },

      // Required for auto-complete suggestions
      {
        name: suggestAll,
        type: basicText,
        multiValued: true,
        stored: true,
      },
      {
        name: suggestUser,
        type: basicText,
        multiValued: true,
        stored: true,
      },
      {
        name: suggestWaitlist,
        type: basicText,
        multiValued: true,
        stored: true,
      },

      // Required on all entries to distinguish them
      {
        name: solrAppFields.entry_type,
        type: solrAppFields.entry_type,
        required: true,
      },

      // Applicable for all entries
      { name: solrAppFields.created_at, type: pdate, required: true },
      { name: solrAppFields.updated_at, type: pdate, required: true },

      // Applicable for user
      { name: solrAppFields.user_email, type: stringFieldType },
      { name: solrAppFields.user_name, type: textGeneral, multiValued: false },
      {
        name: solrAppFields.user_display_name,
        type: textGeneral,
        multiValued: false,
      },
      { name: solrAppFields.user_phone_number, type: stringFieldType },
      { name: solrAppFields.user_app_role, type: appRoleType },
      { name: solrAppFields.user_email_verified, type: booleanFieldType },

      // Applicable for waitlist member
      { name: solrAppFields.waitlist_email, type: stringFieldType },
      {
        name: solrAppFields.waitlist_name,
        type: textGeneral,
        multiValued: false,
      },
    ],

    // Create all of the needed copy fields
    'add-copy-field': [
      {
        source: solrAppFields.user_email,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrAppFields.user_name,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrAppFields.user_display_name,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrAppFields.user_phone_number,
        dest: [...suggestCopyFields, spellcheckUser, suggestUser],
      },
      {
        source: solrAppFields.waitlist_email,
        dest: [...suggestCopyFields, spellcheckWaitlist, suggestWaitlist],
      },
      {
        source: solrAppFields.waitlist_name,
        dest: [...suggestCopyFields, spellcheckWaitlist, suggestWaitlist],
      },
    ],
  });
  console.log(`Created app schema with bulk request: ${prettyJson(res)}`);

  // Make a bulk request to set up the org config
  res = await solrCli.bulkConfigRequest(solrOrgConfigset, {
    // Turn off schemaless mode
    'set-user-property': {
      'update.autoCreateFields': false,
    },

    // Turn on auto soft commits
    'set-property': {
      'updateHandler.autoSoftCommit.maxTime': 60000, // 1 min
      'updateHandler.autoCommit.maxTime': 300000, // 5 mins
    },

    // Add a suggester search component
    'add-searchcomponent': {
      name: suggest,
      class: solrSuggestComponent,
      suggester: [
        {
          ...orgSuggestParams,
          name: solrOrgDictionaries.All,
          field: suggestAll,
        },
        {
          ...orgSuggestParams,
          name: solrOrgDictionaries.Doc,
          field: suggestDoc,
        },
        {
          ...orgSuggestParams,
          name: solrOrgDictionaries.Qna,
          field: suggestQna,
        },
        {
          ...orgSuggestParams,
          name: solrOrgDictionaries.Team,
          field: suggestTeam,
        },
        {
          ...orgSuggestParams,
          name: solrOrgDictionaries.User,
          field: suggestUser,
        },
      ],
    },

    // Modify spellcheck to use basic_text and _spellcheck_text_ instead of text_general and _text_
    'update-searchcomponent': {
      name: spellcheck,
      class: solrSpellcheckComponent,
      queryAnalyzerFieldType: basicText,
      spellchecker: [
        {
          ...spellcheckParams,
          name: solrOrgDictionaries.All,
          field: spellcheckAll,
        },
        {
          ...spellcheckParams,
          name: solrOrgDictionaries.Doc,
          field: spellcheckDoc,
        },
        {
          ...spellcheckParams,
          name: solrOrgDictionaries.Qna,
          field: spellcheckQna,
        },
        {
          ...spellcheckParams,
          name: solrOrgDictionaries.Team,
          field: spellcheckTeam,
        },
        {
          ...spellcheckParams,
          name: solrOrgDictionaries.User,
          field: spellcheckUser,
        },
      ],
    },

    // Add spellcheck and highlighting functionality to the /query request handler
    'update-requesthandler': {
      name: `/${query}`,
      class: solrSearchHandler,
      defaults: {
        ...queryDefaults,
        'spellcheck.dictionary': solrOrgDictionaries.All,
        hl: 'true',
        'hl.fl': Object.values(solrOrgDefaultHighlightedFields),
        'hl.tag.pre': '<strong>',
        'hl.tag.post': '</strong>',
        'hl.defaultSummary': 'true',
      },
      'last-components': [spellcheck],
    },

    // Add a request handler to generate suggestions based on the suggest copy fields
    'add-requesthandler': {
      name: `/${suggest}`,
      class: solrSearchHandler,
      defaults: {
        ...suggestDefaults,
        'suggest.dictionary': solrOrgDictionaries.All,
      },
      components: [suggest],
    },
  });
  console.log(
    `Created org config overlay with bulk request: ${prettyJson(res)}`,
  );

  // Make a bulk request to set up the app config
  res = await solrCli.bulkConfigRequest(solrAppCollection, {
    // Turn off schemaless mode
    'set-user-property': {
      'update.autoCreateFields': false,
    },

    // Turn on auto soft commits
    'set-property': {
      'updateHandler.autoSoftCommit.maxTime': 60000, // 1 min
      'updateHandler.autoCommit.maxTime': 300000, // 5 mins
    },

    // Add a suggester search component
    'add-searchcomponent': {
      name: suggest,
      class: solrSuggestComponent,
      suggester: [
        {
          ...commonSuggestParams,
          name: solrAppDictionaries.All,
          field: suggestAll,
        },
        {
          ...commonSuggestParams,
          name: solrAppDictionaries.User,
          field: suggestUser,
        },
        {
          ...commonSuggestParams,
          name: solrAppDictionaries.Waitlist,
          field: suggestWaitlist,
        },
      ],
    },

    // Modify spellcheck to use basic_text and _spellcheck_text_ instead of text_general and _text_
    'update-searchcomponent': {
      name: spellcheck,
      class: solrSpellcheckComponent,
      queryAnalyzerFieldType: basicText,
      spellchecker: [
        {
          ...spellcheckParams,
          name: solrAppDictionaries.All,
          field: spellcheckAll,
        },
        {
          ...spellcheckParams,
          name: solrAppDictionaries.User,
          field: spellcheckUser,
        },
        {
          ...spellcheckParams,
          name: solrAppDictionaries.Waitlist,
          field: spellcheckWaitlist,
        },
      ],
    },

    // Add spellcheck and highlighting functionality to the /query request handler
    'update-requesthandler': {
      name: `/${query}`,
      class: solrSearchHandler,
      defaults: {
        ...queryDefaults,
        'spellcheck.dictionary': solrAppDictionaries.All,
      },
      'last-components': [spellcheck],
    },

    // Add a request handler to generate suggestions based on the suggest copy fields
    'add-requesthandler': {
      name: `/${suggest}`,
      class: solrSearchHandler,
      defaults: {
        ...suggestDefaults,
        'suggest.dictionary': solrAppDictionaries.All,
      },
      components: [suggest],
    },
  });
  console.log(
    `Created app config overlay with bulk request: ${prettyJson(res)}`,
  );

  // Delete the temporary collection
  res = await solrCli.deleteCollection(solrOrgConfigset);
  console.log(
    `Deleted temporary collection ${solrOrgConfigset}: ${prettyJson(res)}`,
  );
}

/**
 * Deletes the given configset.
 *
 * @param configset The configset to delete.
 * @param options The CLI options for creating a SolrCli instance.
 */
async function deleteConfigset(
  configset: string,
  options: OptionValues,
): Promise<void> {
  const solrCli = createSolrCli(options);
  const res = await solrCli.deleteConfigset(configset);
  console.log(`Deleting configset ${configset}: ${prettyJson(res)}`);
}

/**
 * Downloads the given configset from Zookeeper to the specified destination.
 *
 * @param configset The name of the configset to download in Zookeeper.
 * @param destination The local destination filepath.
 * @param options The CLI options.
 */
async function download(
  configset: string,
  destination: string,
  options: OptionValues,
): Promise<void> {
  const zookeeper: string = options['zookeeper'];

  await execute(
    `solr zk downconfig -n ${configset} -d ${destination} -z ${zookeeper}`,
  );
}

/**
 * Create a configset by uploading one.
 *
 * @param path The path to the zipped configset to upload.
 * @param options The CLI options for creating a SolrCli instance.
 */
async function upload(
  configset: string,
  path: string,
  options: OptionValues,
): Promise<void> {
  const solrCli = createSolrCli(options);
  const res = await solrCli.uploadConfigset(configset, path);
  console.log(`Uploading configset ${configset}: ${prettyJson(res)}`);
}

/**
 * Zips the files located in the specified path and outputs it to the destination.
 *
 * @param path The conf files to zip.
 * @param destination Where to send the zipped files.
 */
async function zip(path: string, destination: string): Promise<void> {
  await execute(`(cd ${path} && zip -r - *) > ${destination}`);
}

/**
 * Creates a SolrCli using the given options.
 *
 * @param options The options object to extract option values from.
 *
 * @returns A new SolrCli instance.
 */
function createSolrCli(options: OptionValues): SolrCli {
  const url: string = options['url'];
  const basicAuth: string | undefined = options['basicAuth'];
  const splitBasicAuth = basicAuth?.split(':');
  return new SolrCli({
    url,
    ...(basicAuth &&
      splitBasicAuth && {
        basicAuth: {
          username: splitBasicAuth[0] ?? '',
          password: splitBasicAuth[1] ?? '',
        },
      }),
  });
}

main();
