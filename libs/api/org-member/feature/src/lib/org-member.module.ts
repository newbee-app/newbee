import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationModule } from '@newbee/api/organization/feature';
import { OrgMemberEntity } from '@newbee/api/shared/data-access';
import { OrgMemberController } from './org-member.controller';

@Module({
  imports: [MikroOrmModule.forFeature([OrgMemberEntity]), OrganizationModule],
  providers: [OrgMemberService],
  controllers: [OrgMemberController],
  exports: [OrgMemberService],
})
export class OrgMemberModule {}
