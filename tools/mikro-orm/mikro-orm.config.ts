import { defineConfig } from '@mikro-orm/postgresql';
import {
  AuthenticatorEntity,
  DocEntity,
  OrganizationEntity,
  OrgMemberEntity,
  PostEntity,
  QnaEntity,
  TeamEntity,
  TeamMemberEntity,
  UserChallengeEntity,
  UserEntity,
  UserSettingsEntity,
} from '@newbee/api/shared/data-access';
import { password, user } from './secret';

export default defineConfig({
  dbName: 'newbee',
  user,
  password,
  debug: true,
  schemaGenerator: {
    disableForeignKeys: false,
  },
  migrations: {
    disableForeignKeys: false,
  },
  entities: [
    AuthenticatorEntity,
    DocEntity,
    OrgMemberEntity,
    OrganizationEntity,
    PostEntity,
    QnaEntity,
    TeamMemberEntity,
    TeamEntity,
    UserChallengeEntity,
    UserSettingsEntity,
    UserEntity,
  ],
});
