import { Options } from '@mikro-orm/core';
import {
  AuthenticatorEntity,
  UserChallengeEntity,
  UserEntity,
  UserSettingsEntity,
} from '@newbee/api/shared/data-access';

const config: Options = {
  type: 'postgresql',
  dbName: 'newbee',
  user: 'ben',
  password: 'ZkPwdL97Y34JuV',
  entities: [
    AuthenticatorEntity,
    UserChallengeEntity,
    UserSettingsEntity,
    UserEntity,
  ],
  migrations: {
    disableForeignKeys: false,
  },
};

export default config;
