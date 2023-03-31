// Creates the base Solr configset that will be used by NewBee to store an organization's docs and qnas

import type { OptionValues } from 'commander';
import { Command } from 'commander';
import { SolrCli } from '../../../libs/publishable/solr-cli/src';
import { execute, prettyJson } from '../util';

/**
 * The configset this script is ultimately responsible for creating on a fresh Solr instance.
 */
const newbeeOrg = 'newbee_org';

/**
 * The main body of the script
 */
async function main(): Promise<void> {
  const program = new Command();

  program
    .name('configset')
    .description(
      'A utility script for working with configsets and setting them up for use by NewBee.'
    )
    .version('1.0.0');

  program
    .command('create')
    .description(
      'Creates the new configset from scratch, without using uploads'
    )
    .option(
      '-u, --url <url>',
      'The URL associated with the Solr instance',
      'http://127.0.0.1:8983'
    )
    .option(
      '-b, --basic-auth <basic-auth>',
      'The username and password to attach to the basic auth portion of request headers (in username:password format)'
    )
    .action(create);

  program
    .command('delete <configset>')
    .description('Deletes the given configset')
    .option(
      '-u, --url <url>',
      'The URL associated with the Solr instance',
      'http://127.0.0.1:8983'
    )
    .option(
      '-b, --basic-auth <basic-auth>',
      'The username and password to attach to the basic auth portion of request headers (in username:password format)'
    )
    .action(deleteConfigset);

  program
    .command('download <configset> <destination>')
    .description('Download the given configset from Solr')
    .option(
      '-z, --zookeeper <zookeeper>',
      `The location of Solr's Zookeeper instance`,
      'localhost:9983'
    )
    .action(download);

  program
    .command('upload <path>')
    .description('Uploads an existing configset')
    .option(
      '-u, --url <url>',
      'The URL associated with the Solr instance',
      'http://127.0.0.1:8983'
    )
    .option(
      '-b, --basic-auth <basic-auth>',
      'The username and password to attach to the basic auth portion of request headers (in username:password format)'
    )
    .action(upload);

  program
    .command('zip <path> <destination>')
    .description(
      'Zip a configset located on the local filepath to get it ready to be uploaded'
    )
    .action(zip);

  await program.parseAsync(process.argv);
}

/**
 * Create a configset from scratch, without uploading anything.
 *
 * @param options The CLI options for creating a SolrCli instance.
 */
async function create(options: OptionValues): Promise<void> {
  const solrCli = createSolrCli(options);

  // Create the configset
  let res = await solrCli.createConfigset({ name: newbeeOrg });
  console.log(`Creating configset '${newbeeOrg}': ${prettyJson(res)}\n`);

  // Upload config files to the configset
  res = await solrCli.uploadConfigset(
    newbeeOrg,
    './enumsConfig.xml',
    'enumsConfig.xml'
  );
  console.log(`Uploading 'enumsConfig.xml' to configset: ${prettyJson(res)}\n`);

  // Create a temporary collection that uses the configset to allow us to make changes to it
  res = await solrCli.createCollection({
    name: newbeeOrg,
    numShards: 1,
    config: newbeeOrg,
  });
  console.log(
    `Creating temporary collection '${newbeeOrg}': ${prettyJson(res)}\n`
  );

  // Make a bulk request to set up the schema
  res = await solrCli.bulkSchemaRequest(newbeeOrg, {
    // Create all of the needed field types
    'add-field-type': [
      {
        name: 'entry_type',
        class: 'solr.EnumFieldType',
        enumsConfig: 'enumsConfig.xml',
        enumName: 'entry',
        docValues: true,
      },
      {
        name: 'basic_text',
        class: 'solr.TextField',
        positionIncrementGap: 100,
        analyzer: {
          tokenizer: {
            name: 'standard',
          },
          filters: [
            {
              name: 'lowercase',
            },
          ],
        },
      },
    ],

    // Create all of the needed fields
    'add-field': [
      // Required for spell checking and stemming
      {
        name: '_basic_text_',
        type: 'basic_text',
        stored: false,
        multiValued: true,
      },
      {
        name: '_user_fields_',
        type: 'basic_text',
        stored: false,
        multiValued: true,
      },
      {
        name: '_doc_fields_',
        type: 'basic_text',
        stored: false,
        multiValued: true,
      },
      {
        name: '_qna_fields_',
        type: 'basic_text',
        stored: false,
        multiValued: true,
      },

      // Required on all entries to distinguish them
      { name: 'entry_type', type: 'entry_type', required: true },

      // Applicable for all entries
      { name: 'slug', type: 'string', required: true },

      // Applicable for user
      { name: 'user_name', type: 'basic_text' },
      { name: 'user_display_name', type: 'basic_text' },

      // Applicable for team
      { name: 'team_name', type: 'basic_text' },

      // Applicable for doc and qna
      { name: 'team', type: 'string' },
      { name: 'created_at', type: 'pdate' },
      { name: 'updated_at', type: 'pdate' },
      { name: 'marked_up_to_date_at', type: 'pdate' },
      { name: 'up_to_date', type: 'boolean', docValues: true },
      { name: 'creator', type: 'string' },
      { name: 'maintainer', type: 'string' },

      // Applicable for doc
      { name: 'doc_title', type: 'basic_text' },
      { name: 'doc_txt', type: 'basic_text' },

      // Applicable for qna
      { name: 'qna_title', type: 'basic_text' },
      { name: 'question_txt', type: 'basic_text' },
      { name: 'answer_txt', type: 'basic_text' },
    ],

    // Create all of the needed copy fields
    'add-copy-field': [
      {
        source: 'user_name',
        dest: ['_text_', '_basic_text_', '_user_fields_'],
      },
      {
        source: 'user_display_name',
        dest: ['_text_', '_basic_text_', '_user_fields_'],
      },
      { source: 'team_name', dest: ['_text_', '_basic_text_'] },
      { source: 'doc_title', dest: ['_text_', '_basic_text_', '_doc_fields_'] },
      { source: 'doc_txt', dest: ['_text_', '_basic_text_', '_doc_fields_'] },
      { source: 'qna_title', dest: ['_text_', '_basic_text_', '_qna_fields_'] },
      {
        source: 'question_txt',
        dest: ['_text_', '_basic_text_', '_qna_fields_'],
      },
      {
        source: 'answer_txt',
        dest: ['_text_', '_basic_text_', '_qna_fields_'],
      },
    ],
  });
  console.log(`Creating schema with bulk request: ${prettyJson(res)}\n`);

  // Make a bulk request to set up the config
  res = await solrCli.bulkConfigRequest(newbeeOrg, {
    // Turn off schemaless mode
    'set-user-property': {
      'update.autoCreateFields': false,
    },

    // Turn on auto soft commits
    'set-property': {
      'updateHandler.autoSoftCommit.maxTime': 60000,
    },

    // Add support for suggester
    'add-searchcomponent': {
      name: 'suggest',
      class: 'solr.SuggestComponent',
      suggester: [
        {
          name: 'default',
          lookupImpl: 'FuzzyLookupFactory',
          dictionaryImpl: 'HighFrequencyDictionaryFactory',
          field: '_basic_text_',
          buildOnCommit: 'true',
          suggestAnalyzerFieldType: 'basic_text',
        },
        {
          name: 'user',
          lookupImpl: 'FuzzyLookupFactory',
          dictionaryImpl: 'HighFrequencyDictionaryFactory',
          field: '_user_fields_',
          buildOnCommit: 'true',
          suggestAnalyzerFieldType: 'basic_text',
        },
        {
          name: 'team',
          lookupImpl: 'FuzzyLookupFactory',
          dictionaryImpl: 'HighFrequencyDictionaryFactory',
          field: 'team_name',
          buildOnCommit: 'true',
          suggestAnalyzerFieldType: 'basic_text',
        },
        {
          name: 'doc',
          lookupImpl: 'FuzzyLookupFactory',
          dictionaryImpl: 'HighFrequencyDictionaryFactory',
          field: '_doc_fields_',
          buildOnCommit: 'true',
          suggestAnalyzerFieldType: 'basic_text',
        },
        {
          name: 'qna',
          lookupImpl: 'FuzzyLookupFactory',
          dictionaryImpl: 'HighFrequencyDictionaryFactory',
          field: '_qna_fields_',
          buildOnCommit: 'true',
          suggestAnalyzerFieldType: 'basic_text',
        },
      ],
    },

    // Modify spellcheck to use _basic_text_ and basic_text instead of _text_ and text_general
    'update-searchcomponent': {
      name: 'spellcheck',
      class: 'solr.SpellCheckComponent',
      queryAnalyzerFieldType: 'basic_text',
      spellchecker: [
        {
          name: 'default',
          field: '_basic_text_',
          classname: 'solr.DirectSolrSpellChecker',
          distanceMeasure: 'internal',
          accuracy: 0.5,
          maxEdits: 2,
          minPrefix: 1,
          maxInspections: 5,
          minQueryLength: 4,
          maxQueryFrequency: 0.01,
        },
        {
          name: 'user',
          field: '_user_fields_',
          classname: 'solr.DirectSolrSpellChecker',
          distanceMeasure: 'internal',
          accuracy: 0.5,
          maxEdits: 2,
          minPrefix: 1,
          maxInspections: 5,
          minQueryLength: 4,
          maxQueryFrequency: 0.01,
        },
        {
          name: 'team',
          field: '_team_fields_',
          classname: 'solr.DirectSolrSpellChecker',
          distanceMeasure: 'internal',
          accuracy: 0.5,
          maxEdits: 2,
          minPrefix: 1,
          maxInspections: 5,
          minQueryLength: 4,
          maxQueryFrequency: 0.01,
        },
        {
          name: 'doc',
          field: '_doc_fields_',
          classname: 'solr.DirectSolrSpellChecker',
          distanceMeasure: 'internal',
          accuracy: 0.5,
          maxEdits: 2,
          minPrefix: 1,
          maxInspections: 5,
          minQueryLength: 4,
          maxQueryFrequency: 0.01,
        },
        {
          name: 'qna',
          field: '_qna_fields_',
          classname: 'solr.DirectSolrSpellChecker',
          distanceMeasure: 'internal',
          accuracy: 0.5,
          maxEdits: 2,
          minPrefix: 1,
          maxInspections: 5,
          minQueryLength: 4,
          maxQueryFrequency: 0.01,
        },
      ],
    },

    // Add suggester functionality with endpoint /suggest
    'add-requesthandler': {
      name: '/suggest',
      class: 'solr.SearchHandler',
      defaults: {
        wt: 'json',
        indent: 'true',
        suggest: 'true',
        'suggest.dictionary': 'default',
        'suggest.count': '10',
      },
      'last-components': ['suggest'],
    },

    // Add spellcheck and highlighting functionality to the /query request handler
    'update-requesthandler': {
      name: '/query',
      class: 'solr.SearchHandler',
      defaults: {
        wt: 'json',
        indent: 'true',
        hl: 'true',
        'hl.tag.pre': '<strong>',
        'hl.tag.post': '</strong>',
        'hl.defaultSummary': 'true',
        'hl.fl': ['doc_txt', 'question_txt', 'answer_txt'],
        spellcheck: 'true',
        'spellcheck.count': '1',
        'spellcheck.alternativeTermCount': '5',
        'spellcheck.extendedResults': 'true',
        'spellcheck.collate': 'true',
        'spellcheck.maxCollations': '1',
        'spellcheck.maxCollationTries': '10',
        'spellcheck.collateExtendedResults': 'true',
        'spellcheck.maxResultsForSuggest': '3',
        'spellcheck.dictionary': 'default',
        suggest: 'true',
        'suggest.dictionary': 'default',
        'suggest.count': '10',
      },
      'last-components': ['spellcheck', 'suggest'],
    },
  });
  console.log(
    `Creating config overlay with bulk request: ${prettyJson(res)}\n`
  );

  // Delete the temporary collection
  res = await solrCli.deleteCollection(newbeeOrg);
  console.log(
    `Deleting temporary collection '${newbeeOrg}': ${prettyJson(res)}\n`
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
  options: OptionValues
): Promise<void> {
  const solrCli = createSolrCli(options);
  const res = await solrCli.deleteConfigset(configset);
  console.log(`Deleting configset '${configset}': ${prettyJson(res)}`);
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
  options: OptionValues
): Promise<void> {
  const zookeeper: string = options['zookeeper'];

  await execute(
    `solr zk downconfig -n ${configset} -d ${destination} -z ${zookeeper}`
  );
}

/**
 * Create a configset by uploading one.
 *
 * @param path The path to the zipped configset to upload.
 * @param options The CLI options for creating a SolrCli instance.
 */
async function upload(path: string, options: OptionValues): Promise<void> {
  const solrCli = createSolrCli(options);
  const res = await solrCli.uploadConfigset(newbeeOrg, path);
  console.log(`Uploading configset '${newbeeOrg}': ${prettyJson(res)}`);
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
