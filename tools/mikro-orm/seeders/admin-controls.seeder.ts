import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AdminControlsEntity } from '@newbee/api/shared/data-access';
import { adminControlsId } from '@newbee/api/shared/util';

/**
 * Creates admin controls.
 * If admin controls already exist, it does nothing.
 */
export class AdminControlsSeeder extends Seeder {
  override async run(
    em: EntityManager<IDatabaseDriver<Connection>>,
  ): Promise<void> {
    if (await em.findOne(AdminControlsEntity, adminControlsId)) {
      console.log('Admin controls already exist, skipping...');
      return;
    }

    console.log('Creating admin controls');
    const adminControls = new AdminControlsEntity();
    em.persist(adminControls);
  }
}
