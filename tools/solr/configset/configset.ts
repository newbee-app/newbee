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
      'A utility script for working with configsets and setting them up for use by NewBee.',
    )
    .version('1.0.0');

  program
    .command('create')
    .description(
      'Creates the new configset from scratch, without using uploads',
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
    .command('upload <path>')
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
 * Create a configset from scratch, without uploading anything.
 *
 * @param options The CLI options for creating a SolrCli instance.
 */
async function create(options: OptionValues): Promise<void> {
  // Create all of the constants I'll reuse in the method to avoid typos

  // Related to outside files
  const enumsConfigXml = 'enumsConfig.xml';

  // Related to field types
  const entryType = 'entry_type';
  const orgRoleType = 'org_role_type';
  const solrEnumFieldType = 'solr.EnumFieldType';
  const entryEnumName = 'entry';
  const orgRoleEnumName = 'org_role';
  const basicText = 'basic_text';
  const solrTextField = 'solr.TextField';
  const standard = 'standard';
  const lowercase = 'lowercase';
  const edgeNGramText = 'edge_n_gram_text';
  const stringFieldType = 'string';
  const pdate = 'pdate';
  const textGeneral = 'text_general';

  // Related to fields
  const textField = '_text_';
  const spellcheckText = '_spellcheck_text_';
  const suggestText = '_suggest_text_';
  const suggestNGramText = '_suggest_n_gram_text_';
  const slug = 'slug';
  const userName = 'user_name';
  const userDisplayName = 'user_display_name';
  const userEmail = 'user_email';
  const userPhoneNumber = 'user_phone_number';
  const userOrgRole = 'org_role';
  const teamName = 'team_name';
  const team = 'team';
  const createdAt = 'created_at';
  const updatedAt = 'updated_at';
  const markedUpToDateAt = 'marked_up_to_date_at';
  const outOfDateAt = 'out_of_date_at';
  const title = 'title';
  const creator = 'creator';
  const maintainer = 'maintainer';
  const docTxt = 'doc_txt';
  const questionTxt = 'question_txt';
  const answerTxt = 'answer_txt';
  const commonCopyFields = [textField, spellcheckText];
  const suggestCopyFields = [
    ...commonCopyFields,
    suggestText,
    suggestNGramText,
  ];

  // Related to request handlers
  const defaultName = 'default';
  const spellcheck = 'spellcheck';
  const solrSpellCheckComponent = 'solr.SpellCheckComponent';
  const solrSearchHandler = 'solr.SearchHandler';
  const highlightFields = [docTxt, questionTxt, answerTxt];
  const searchDefaults = {
    wt: 'json',
    indent: 'true',
    defType: 'edismax',
  };
  const spellcheckDefaults = {
    spellcheck: 'true',
    'spellcheck.count': '1',
    'spellcheck.alternativeTermCount': '5',
    'spellcheck.extendedResults': 'true',
    'spellcheck.collate': 'true',
    'spellcheck.maxCollations': '1',
    'spellcheck.maxCollationTries': '10',
    'spellcheck.collateExtendedResults': 'true',
    'spellcheck.maxResultsForSuggest': '3',
    'spellcheck.dictionary': defaultName,
  };

  const solrCli = createSolrCli(options);

  // Check if the newbeeOrg configset already exists
  const configsets = (await solrCli.listConfigsets()).configSets;
  if (configsets.includes(newbeeOrg)) {
    let res = await solrCli.deleteConfigset(newbeeOrg);
    console.log(
      `Deleting existing ${newbeeOrg} configset: ${prettyJson(res)}\n`,
    );
  }

  // Create the configset
  let res = await solrCli.createConfigset({ name: newbeeOrg });
  console.log(`Creating configset '${newbeeOrg}': ${prettyJson(res)}\n`);

  // Upload config files to the configset
  res = await solrCli.uploadConfigset(
    newbeeOrg,
    enumsConfigXml,
    enumsConfigXml,
  );
  console.log(
    `Uploading '${enumsConfigXml}' to configset: ${prettyJson(res)}\n`,
  );

  // Create a temporary collection that uses the configset to allow us to make changes to it
  res = await solrCli.createCollection({
    name: newbeeOrg,
    numShards: 1,
    config: newbeeOrg,
  });
  console.log(
    `Creating temporary collection '${newbeeOrg}': ${prettyJson(res)}\n`,
  );

  // Make a bulk request to set up the schema
  res = await solrCli.bulkSchemaRequest(newbeeOrg, {
    // Create all of the needed field types
    'add-field-type': [
      // An enum describing the type of the entry
      {
        name: entryType,
        class: solrEnumFieldType,
        enumsConfig: enumsConfigXml,
        enumName: entryEnumName,
        docValues: true,
      },

      // An enum describing possible roles for org members
      {
        name: orgRoleType,
        class: solrEnumFieldType,
        enumsConfig: enumsConfigXml,
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
        name: spellcheckText,
        type: basicText,
        multiValued: true,
        stored: false,
      },

      // Required for auto-complete suggestions
      // Includes all queryable fields
      {
        name: suggestText,
        type: basicText,
        multiValued: true,
        stored: false,
      },
      // Only includes titles and such, no body text
      {
        name: suggestNGramText,
        type: edgeNGramText,
        multiValued: true,
        stored: false,
      },

      // Required on all entries to distinguish them
      { name: entryType, type: entryType, required: true },

      // Applicable for all entries
      { name: slug, type: stringFieldType, required: true },

      // Applicable for user
      { name: userEmail, type: stringFieldType },
      { name: userName, type: textGeneral, multiValued: false },
      { name: userDisplayName, type: textGeneral, multiValued: false },
      { name: userPhoneNumber, type: stringFieldType },
      { name: userOrgRole, type: orgRoleType },

      // Applicable for team
      { name: teamName, type: textGeneral, multiValued: false },

      // Applicable for doc and qna
      { name: team, type: stringFieldType },
      { name: createdAt, type: pdate },
      { name: updatedAt, type: pdate },
      { name: markedUpToDateAt, type: pdate },
      { name: outOfDateAt, type: pdate },
      { name: title, type: stringFieldType },
      { name: creator, type: stringFieldType },
      { name: maintainer, type: stringFieldType },

      // Applicable for doc
      { name: docTxt, type: textGeneral, multiValued: false },

      // Applicable for qna
      { name: questionTxt, type: textGeneral, multiValued: false },
      { name: answerTxt, type: textGeneral, multiValued: false },
    ],

    // Create all of the needed copy fields
    'add-copy-field': [
      { source: userEmail, dest: suggestCopyFields },
      { source: userName, dest: suggestCopyFields },
      { source: userDisplayName, dest: suggestCopyFields },
      { source: userPhoneNumber, dest: suggestCopyFields },
      { source: teamName, dest: suggestCopyFields },
      { source: title, dest: suggestCopyFields },
      { source: docTxt, dest: commonCopyFields },
      { source: questionTxt, dest: commonCopyFields },
      { source: answerTxt, dest: commonCopyFields },
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

    // Modify spellcheck to use _basic_text_ and basic_text instead of _text_ and text_general
    'update-searchcomponent': {
      name: spellcheck,
      class: solrSpellCheckComponent,
      queryAnalyzerFieldType: basicText,
      spellchecker: {
        name: defaultName,
        field: spellcheckText,
        classname: 'solr.DirectSolrSpellChecker',
        distanceMeasure: 'internal',
        accuracy: 0.5,
        maxEdits: 2,
        minPrefix: 1,
        maxInspections: 5,
        minQueryLength: 4,
        maxQueryFrequency: 0.01,
      },
    },

    // Add spellcheck and highlighting functionality to the /query request handler
    'update-requesthandler': {
      name: '/query',
      class: solrSearchHandler,
      defaults: {
        ...searchDefaults,
        ...spellcheckDefaults,
        hl: 'true',
        'hl.tag.pre': '<strong>',
        'hl.tag.post': '</strong>',
        'hl.defaultSummary': 'true',
        'hl.fl': highlightFields,
      },
      'last-components': [spellcheck],
    },

    // Add a request handler to generate suggestions based on titles
    'add-requesthandler': {
      name: '/suggest',
      class: solrSearchHandler,
      defaults: {
        ...searchDefaults,
        ...spellcheckDefaults,
        qf: `${suggestText}^10 ${suggestNGramText}`,
      },
      'last-components': [spellcheck],
    },
  });
  console.log(
    `Creating config overlay with bulk request: ${prettyJson(res)}\n`,
  );

  // Delete the temporary collection
  res = await solrCli.deleteCollection(newbeeOrg);
  console.log(
    `Deleting temporary collection '${newbeeOrg}': ${prettyJson(res)}\n`,
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
