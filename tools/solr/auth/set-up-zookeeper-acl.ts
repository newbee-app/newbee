// Sets up ACLs (Access Control Lists) for Solr's Zookeeper instance

import { Command } from 'commander';
import { appendFileSync } from 'fs';
import { execute, fileToJson } from '../util';

/**
 * Get the options needed to run the script.
 *
 * @returns The options needed to run the script.
 */
function args(): Command {
  const program = new Command();

  program
    .name('set-up-zooker-acl')
    .description(`Sets up ACL for Solr's Zookeeper instance`)
    .version('1.0.0');

  program
    .option(
      '-c, --credentials-json <credentials-json>',
      'The path to a JSON file mapping Zookeeper credentials from username to password',
      'zookeeper-creds.json'
    )
    .option(
      '-z, --zookeeper <zookeeper>',
      `The location of Solr's Zookeeper instance`,
      'localhost:9983'
    )
    .requiredOption('-o, --stop <stop>', 'The command to run to stop Solr')
    .requiredOption('-a, --start <start>', 'The command to run to start Solr')
    .requiredOption(
      '-s, --solr-home <solr-home>',
      `The path to Solr's home directory`
    );

  return program.parse();
}

/**
 * The main body of the script.
 */
async function main(): Promise<void> {
  const program = args();
  const options = program.opts();

  // Stop the Solr isntance
  const stopCmd: string = options['stop'];
  await execute(stopCmd);

  // Get the passwords for the Zookeeper users
  const zkCredsPath: string = options['credentialsJson'];
  const zkUsers: { 'admin-user': string; 'readonly-user': string } =
    fileToJson(zkCredsPath);

  // Change the zkcli.sh file to include the new ACLs and credentials
  const solrHome: string = options['solrHome'];
  const zkCliPath = `${solrHome}/server/scripts/cloud-scripts/zkcli.sh`;
  const solrZkCredsAndAcls = `\nSOLR_ZK_CREDS_AND_ACLS="-DzkACLProvider=org.apache.solr.common.cloud.DigestZkACLProvider -DzkCredentialsProvider=org.apache.solr.common.cloud.DigestZkCredentialsProvider -DzkCredentialsInjector=org.apache.solr.common.cloud.VMParamsZkCredentialsInjector -DzkDigestUsername=admin-user -DzkDigestPassword=${zkUsers['admin-user']} -DzkDigestReadonlyUsername=readonly-user -DzkDigestReadonlyPassword=${zkUsers['readonly-user']}"\n`;
  appendFileSync(zkCliPath, solrZkCredsAndAcls);

  const solrInShPath = `${solrHome}/share/solr/solr.in.sh`;
  appendFileSync(
    solrInShPath,
    `${solrZkCredsAndAcls}SOLR_OPTS="$SOLR_OPTS $SOLR_ZK_CREDS_AND_ACLS"\n`
  );

  // Start up Solr again
  const startCmd: string = options['start'];
  await execute(startCmd);

  // Use zkcli.sh to update credentials for Zookeeper
  const zookeeper: string = options['zookeeper'];
  await execute(`${zkCliPath} -z ${zookeeper} -cmd updateacls /solr`);

  // Restart Solr
  await execute(stopCmd);
  await execute(startCmd);
}

main();
