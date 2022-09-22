import { testUser1, testUserSettings1 } from '@newbee/shared/util';
import { UserEntity, UserSettingsEntity } from '../entity';

const { fullName, ...rest } = testUser1;
fullName; // to shut up the unused var warning
export const testUserEntity1 = new UserEntity(rest);

export const testUserSettingsEntity1 = new UserSettingsEntity(
  testUserSettings1
);
