// Turns plain text passwords into a format usable for Solr basic auth

import { Command } from 'commander';
import { createHash, randomBytes } from 'crypto';
import { fileToJson, prettyJson } from '../util';

/**
 * The main function to call to kick off the script.
 */
function main(): void {
  const program = new Command();

  program
    .name('basic-auth-pw')
    .description('Works with passwords used for basic authentication in Solr.')
    .version('1.0.0');

  program
    .command('generate <password>')
    .description(
      'Turns a plain text password into a format usable for basic authentication in Solr'
    )
    .action(generatePw);

  program
    .command('reverse <password> <solr-password>')
    .description(
      'Checks whether a plain text password matches the expected Solr password'
    )
    .action(reversePw);

  program
    .command('generate-all <users-file>')
    .description(
      'Takes in a JSON file mapping usernames to plain text passwords and generates a Solr-format password for all users'
    )
    .action(generateAllPw);

  program.parse(process.argv);
}

/**
 * Turns the provided plain text password into a format usable for basic authentication in Solr.
 *
 * @param password The plain text password to transform.
 */
function generatePw(password: string): void {
  const [hashedPassword, salt] = generatePwValues(password);
  console.log(`${hashedPassword} ${salt}`);
}

/**
 * Turns the provided plain text password (and optionally a salt) into a format usable for basic authentication in Solr.
 *
 * @param password The plain text password to transform.
 * @param salt An optional value to use as a salt.
 *
 * @returns A tuple specifying the hashed password first, and the used salt second.
 */
function generatePwValues(password: string, salt?: Buffer): [string, string] {
  // Generate a random salt
  if (!salt) {
    salt = randomBytes(32);
  }

  // Create a hash by including the salt and then the password
  let hash = createHash('sha256');
  hash.update(salt);
  hash.update(password, 'utf-8');
  let hashedPassword = hash.digest();

  // Hash the hashed password
  hash = createHash('sha256');
  hash.update(hashedPassword);
  hashedPassword = hash.digest();

  // Convert the byte values to strings by encoding them in base64 format
  return [hashedPassword.toString('base64'), salt.toString('base64')];
}

/**
 * Checks whether the provided plain text password matches the expected Solr password.
 *
 * @param password The password in plain text format.
 * @param solrPassword The password in Solr format.
 */
function reversePw(password: string, solrPassword: string): void {
  const [expectedPassword, expectedSalt] = solrPassword.split(' ');
  const saltBuff = Buffer.from(expectedSalt, 'base64');
  const [receivedPassword, receivedSalt] = generatePwValues(password, saltBuff);

  console.log(`Expected: ${solrPassword}`);
  console.log(`Received: ${receivedPassword} ${receivedSalt}`);
  console.log(`Salts match? ${expectedSalt === receivedSalt}`);
  console.log(
    `Hashed passwords match? ${expectedPassword === receivedPassword}`
  );
}

/**
 * Takes in a JSON file mapping usernames to plain text passwords and generates a Solr-format password for all users
 *
 * @param usersFile The path to the JSON file containing user information.
 */
function generateAllPw(usersFile: string): void {
  const users: { [username: string]: string } = fileToJson(usersFile);
  const solrUsers: { [username: string]: string } = {};
  for (const [username, password] of Object.entries(users)) {
    const [hashedPassword, salt] = generatePwValues(password);
    solrUsers[username] = `${hashedPassword} ${salt}`;
  }

  console.log(prettyJson(solrUsers));
}

main();
