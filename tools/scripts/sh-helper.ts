import type { OptionValues } from 'commander';
import { Command } from 'commander';
import { generate } from 'generate-password';
import { parseIntOrThrow } from './util';

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('sh-helper')
    .description(
      'A utility script meant to be called by sh scripts in the project.'
    )
    .version('1.0.0');

  program
    .command('gen-password')
    .description('Creates a random secure password')
    .option('-s, --symbols', 'A flag to include symbols in the password')
    .action(genPassword);

  program
    .command('gen-passwords <count>')
    .description('Creates the desired number of random secure passwords')
    .option('-s, --symbols', 'A flag to include symbols in the passwords')
    .action(genPasswords);

  await program.parseAsync(process.argv);
}

/**
 * Function that generates a strong random password and prints it to the console.
 *
 * @param options The CLI options.
 */
function genPassword(options: OptionValues): void {
  const password = generate({
    length: 14,
    numbers: true,
    symbols: options['symbols'] ? '!@#$%^&*' : false,
    strict: true,
  });
  console.log(password);
}

/**
 * Function that generates a desired number of strong random passwords and prints them to the console.
 *
 * @param countStr The amount of passwords to generate, as a string.
 * @param options The CLI options.
 */
function genPasswords(countStr: string, options: OptionValues): void {
  const count = parseIntOrThrow(countStr);
  for (let i = 0; i < count; ++i) {
    genPassword(options);
  }
}

main();
