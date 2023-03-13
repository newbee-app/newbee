import { exec as execCb } from 'child_process';
import { readFileSync } from 'fs';
import { promisify } from 'util';

const exec = promisify(execCb);

/**
 * Executes the given command and logs its output.
 *
 * @param command The command to execute.
 */
export async function execute(command: string): Promise<void> {
  const { stdout, stderr } = await exec(command);
  console.log(stdout);
  console.error(stderr);
}

/**
 * Takes in a path to a JSON file and return the parsed POJO.
 *
 * @param filepath The path to the JSON file.
 *
 * @returns The file as a parsed POJO.
 */
export function fileToJson(filepath: string): any {
  const rawFile = readFileSync(filepath, 'utf-8');
  return JSON.parse(rawFile);
}

/**
 * Takes in a POJO and turns it into a prettified JSON string.
 *
 * @param pojo The POJO to turn into a string.
 */
export function prettyJson(pojo: any): string {
  return JSON.stringify(pojo, null, 2);
}
