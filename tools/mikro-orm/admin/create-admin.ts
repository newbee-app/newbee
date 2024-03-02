import { MikroORM } from '@mikro-orm/postgresql';
import {
  AdminControlsEntity,
  UserDocParams,
  UserEntity,
  UserInvitesEntity,
} from '@newbee/api/shared/data-access';
import { adminControlsId, solrAppCollection } from '@newbee/api/shared/util';
import { UserRoleEnum } from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { isEmail } from 'class-validator';
import { Command, OptionValues } from 'commander';
import { v4 } from 'uuid';
import solrConfig from '../../solr/solr.config';
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

  program
    .command('controls')
    .description('Create admin controls')
    .action(createAdminControls);

  program.parse(process.argv);
}

/**
 * Creates a new admin user using the provided email and option values.
 *
 * @param email The email for the admin user.
 * @param options Additional options for the new admin user.
 */
async function create(email: string, options: OptionValues): Promise<void> {
  let name: string | undefined = options['name'];
  email = email.trim();
  name = name?.trim();
  if (!isEmail(email)) {
    throw new Error(`${email} is not a valid email value`);
  }

  const orm = await MikroORM.init(config);
  const em = orm.em.fork();
  let user = await em.findOne(UserEntity, { email });
  const isReplace = !!user;
  if (user && user.role === UserRoleEnum.Admin) {
    console.log('User is already an admin, no changes necessary');
    await orm.close();
    return;
  }

  await em.transactional(async (em) => {
    if (user) {
      console.log(
        `Found an existing user with the email ${email}, upgrading the existing user's privileges`,
      );
      user = em.assign(user, { role: UserRoleEnum.Admin });
    } else {
      console.log(`Creating a new admin user with the email ${email}`);
      let userInvites = await em.findOne(UserInvitesEntity, { email });
      userInvites = userInvites ?? new UserInvitesEntity(v4(), email);
      user = new UserEntity(
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
    await em.flush();

    const solrCli = new SolrCli(solrConfig);
    if (isReplace) {
      await solrCli.getVersionAndReplaceDocs(
        solrAppCollection,
        new UserDocParams(user),
      );
    } else {
      await solrCli.addDocs(solrAppCollection, new UserDocParams(user));
    }
  });

  console.log('Successfully created admin user');
  await orm.close();
}

/**
 * Creates the NewBee instance's admin controls.
 */
async function createAdminControls(): Promise<void> {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();
  let adminControls = await em.findOne(AdminControlsEntity, adminControlsId);
  if (adminControls) {
    console.log('Admin controls already exist, no changes necessary');
    await orm.close();
    return;
  }

  console.log('Creating new admin controls');
  adminControls = new AdminControlsEntity();
  await em.persistAndFlush(adminControls);
  console.log('Successfully created admin controls');

  await orm.close();
}

main();
