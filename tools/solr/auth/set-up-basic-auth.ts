// Sets up basic authentication for a Solr instance

import { Command } from 'commander';
import { execute } from '../util';

/**
 * Retrieves all of the CLI options associated with the script.
 *
 * @returns The Command object holding the CLI options.
 */
function args(): Command {
  const program = new Command();

  program
    .name('set-up-basic-auth')
    .description('Sets up basic authentication for a clean Solr instance')
    .version('1.0.0');

  program
    .option(
      '-z, --zookeeper <zookeeper>',
      `The location of Solr's Zookeeper instance`,
      'localhost:9983'
    )
    .option(
      '-s --security-json <security-json>',
      'The location of the security.json file',
      './security.json'
    );

  return program.parse();
}

/**
 * The main body of the script.
 */
async function main(): Promise<void> {
  const program = args();
  const options = program.opts();
  const zookeeper: string = options['zookeeper'];
  const securityJson: string = options['securityJson'];

  await execute(`solr zk cp ${securityJson} zk:security.json -z ${zookeeper}`);
}

main();
