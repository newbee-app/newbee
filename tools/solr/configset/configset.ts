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

  await program.parseAsync(process.argv);
}

/**
 * Create a configset from scratch, without uploading anything.
 *
 * @param options The CLI options for creating a SolrCli instance.
 */
async function create(options: OptionValues): Promise<void> {
  const solrCli = createSolrCli(options);

  // Create configset and a temporary collection that uses the configset to allow us to make changes to it
  let res = await solrCli.createConfigset({ name: newbeeOrg });
  console.log(`Creating configset '${newbeeOrg}': ${prettyJson(res)}\n`);
  res = await solrCli.createCollection({
    name: newbeeOrg,
    numShards: 1,
    config: newbeeOrg,
  });
  console.log(
    `Creating temporary collection '${newbeeOrg}': ${prettyJson(res)}\n`
  );

  // Turn off schemaless mode
  res = await solrCli.setUserProperty(newbeeOrg, {
    'update.autoCreateFields': 'false',
  });
  console.log(
    `Turning off schemaless mode by setting user property 'update.autoCreateFields' to 'false': ${prettyJson(
      res
    )}\n`
  );

  // Upload config files to the configset
  res = await solrCli.uploadConfigset(
    newbeeOrg,
    './enumsConfig.xml',
    'enumsConfig.xml'
  );
  console.log(`Uploading 'enumsConfig.xml' to configset: ${prettyJson(res)}\n`);

  // Make a bulk request to set up the schema
  res = await solrCli.bulkSchemaRequest(newbeeOrg, {
    // Create all of the needed field types
    'add-field-type': {
      name: 'entry_type',
      class: 'solr.EnumFieldType',
      enumsConfig: 'enumsConfig.xml',
      enumName: 'entry',
      docValues: true,
    },

    // Create all of the needed fields
    'add-field': [
      // Required on all entries to distinguish them
      { name: 'entry_type', type: 'entry_type', required: true },

      // Applicable for team and member
      { name: 'name', type: 'string', multiValued: true },

      // Applicable for doc and qna
      { name: 'team', type: 'string' },
      { name: 'created_at', type: 'pdate' },
      { name: 'updated_at', type: 'pdate' },
      { name: 'marked_up_to_date_at', type: 'pdate' },
      { name: 'up_to_date', type: 'boolean', docValues: true },
      { name: 'title', type: 'string' },
      { name: 'creator', type: 'string' },
      { name: 'maintainer', type: 'string' },

      // Applicable for doc
      { name: 'doc_body', type: 'text_en' },

      // Applicable for qna
      { name: 'question_details', type: 'text_en' },
      { name: 'answer', type: 'text_en' },
    ],

    // Create all of the needed copy fields
    'add-copy-field': [
      { source: 'name', dest: '_text_' },
      { source: 'title', dest: '_text_' },
      { source: 'doc_body', dest: '_text_' },
      { source: 'question_details', dest: '_text_' },
      { source: 'answer', dest: '_text_' },
    ],
  });
  console.log(`Creating schema with bulk request: ${prettyJson(res)}\n`);

  // Delete the temporary configset
  res = await solrCli.deleteCollection(newbeeOrg);
  console.log(
    `Deleting temporary configset '${newbeeOrg}': ${prettyJson(res)}\n`
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
        basicAuth: { username: splitBasicAuth[0], password: splitBasicAuth[1] },
      }),
  });
}

main();
