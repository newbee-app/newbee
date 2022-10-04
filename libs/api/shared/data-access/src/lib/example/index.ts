import { testUser1, testUserSettings1 } from '@newbee/shared/util';
import { UserEntity, UserSettingsEntity } from '../entity';

export const testUserEntity1 = new UserEntity(testUser1);

export const testUserSettingsEntity1 = new UserSettingsEntity(
  testUserSettings1
);
