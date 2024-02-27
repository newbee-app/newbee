import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrgMemberEntity } from '@newbee/api/shared/data-access';
import { OrgMemberController } from './org-member.controller';

@Module({
  imports: [MikroOrmModule.forFeature([OrgMemberEntity])],
  providers: [OrgMemberService],
  controllers: [OrgMemberController],
  exports: [OrgMemberService],
})
export class OrgMemberModule {}
