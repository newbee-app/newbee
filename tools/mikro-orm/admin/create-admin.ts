import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { UserEntity, UserInvitesEntity } from '@newbee/api/shared/data-access';
import { UserRoleEnum } from '@newbee/shared/util';
import { isEmail } from 'class-validator';
import { Command, OptionValues } from 'commander';
import { v4 } from 'uuid';
import config from '../mikro-orm.config';

/**
 * The main body of the script.
 */
function main(): void {
  const program = new Command();

  program
    .name('create-admin')
    .description('Creates a new admin user for NewBee')
    .version('1.0.0');

  program
    .command('create <email>')
    .description('Create a new admin user using a specified email')
    .option('-n, --name <name>', 'The name to associate with the admin user')
    .action(create);

  program.parse(process.argv);
}

/**
 * Creates a new admin user using the provided email and option values.
 *
 * @param email The email for the admin user.
 * @param options Additional options for the new admin user.
 */
async function create(email: string, options: OptionValues): Promise<void> {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();
  await createOrUpgradeAdminUser(em, email, options['name']);
  await em.flush();
  console.log('Successfully created admin user');
  await orm.close();
}

/**
 * A helper function for creating a new admin user or upgrading an existing user to have admin privileges.
 *
 * NOTE: The function does NOT call flush, so it's up to the caller to do so.
 *
 * @param em The entity manager to use.
 * @param email The email for the admin user.
 * @param name The name for the admin user, if creating a new one.
 *
 * @throws {Error} If the email is not a valid email value.
 */
export async function createOrUpgradeAdminUser(
  em: EntityManager,
  email: string,
  name?: string | undefined | null,
): Promise<void> {
  email = email.trim();
  name = name?.trim();
  if (!isEmail(email)) {
    throw new Error(`${email} is not a valid email value`);
  }

  const existingUser = await em.findOne(UserEntity, { email });
  if (existingUser) {
    console.log(
      `Found an existing user with the email ${email}, upgrading the existing user's privileges`,
    );
    em.assign(existingUser, {
      role: UserRoleEnum.Admin,
      updatedAt: new Date(),
    });
    return;
  }

  console.log(`Creating a new admin user with the email ${email}`);
  let userInvites = await em.findOne(UserInvitesEntity, { email });
  userInvites = userInvites ?? new UserInvitesEntity(v4(), email);
  const user = new UserEntity(
    v4(),
    email,
    name || 'NewBee Admin',
    null,
    null,
    null,
    UserRoleEnum.Admin,
    userInvites,
  );
  em.persist(user);
}

main();
