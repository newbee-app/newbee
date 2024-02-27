import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import {
  AdminControlsEntity,
  AuthenticatorEntity,
  DocEntity,
  OrganizationEntity,
  OrgMemberEntity,
  OrgMemberInviteEntity,
  PostEntity,
  QnaEntity,
  TeamEntity,
  TeamMemberEntity,
  UserEntity,
  UserInvitesEntity,
  WaitlistMemberEntity,
} from '@newbee/api/shared/data-access';

export default defineConfig({
  host: process.env['POSTGRES_HOST'] as string,
  port: parseInt(process.env['POSTGRES_PORT'] as string, 10),
  dbName: process.env['POSTGRES_DB'] as string,
  user: process.env['POSTGRES_USER'] as string,
  password: process.env['POSTGRES_PASSWORD'] as string,
  forceUtcTimezone: true,
  debug: true,
  schemaGenerator: {
    disableForeignKeys: false,
  },
  migrations: {
    disableForeignKeys: false,
  },
  extensions: [SeedManager],
  entities: [
    AdminControlsEntity,
    AuthenticatorEntity,
    DocEntity,
    OrgMemberInviteEntity,
    OrgMemberEntity,
    OrganizationEntity,
    PostEntity,
    QnaEntity,
    TeamMemberEntity,
    TeamEntity,
    UserInvitesEntity,
    UserEntity,
    WaitlistMemberEntity,
  ],
});
