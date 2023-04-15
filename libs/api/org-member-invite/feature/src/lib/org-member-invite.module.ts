import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrgMemberInviteService } from '@newbee/api/org-member-invite/data-access';
import { orgMemberInviteConfig } from '@newbee/api/org-member-invite/util';
import { OrgMemberModule } from '@newbee/api/org-member/feature';
import { OrganizationModule } from '@newbee/api/organization/feature';
import { OrgMemberInviteEntity } from '@newbee/api/shared/data-access';
import { UserInvitesModule } from '@newbee/api/user-invites/feature';
import { UserModule } from '@newbee/api/user/feature';
import { OrgMemberInviteController } from './org-member-invite.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([OrgMemberInviteEntity]),
    ConfigModule.forFeature(orgMemberInviteConfig),
    UserModule,
    UserInvitesModule,
    OrgMemberModule,
    OrganizationModule,
  ],
  controllers: [OrgMemberInviteController],
  providers: [OrgMemberInviteService],
  exports: [OrgMemberInviteService],
})
export class OrgMemberInviteModule {}
