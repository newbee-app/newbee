import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { createOrUpgradeAdminUser } from '../admin';

/**
 * Generates the initial admin user.
 *
 * If for some reason the user decides to run the seeder on an existing non-admin user, it handles this case by bumping the existing user's permissions.
 *
 * @throws {Error} If the user does not specify an admin email in the .env file.
 */
export class AdminSeeder extends Seeder {
  override async run(em: EntityManager): Promise<void> {
    const adminEmail = process.env['ADMIN_EMAIL'];
    if (!adminEmail) {
      throw new Error(
        '.env file does not specify a valid admin email, admin user cannot be created',
      );
    }

    const adminName = process.env['ADMIN_NAME'];
    await createOrUpgradeAdminUser(em, adminEmail, adminName);
  }
}
