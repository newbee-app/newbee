import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrgMemberEntity } from '@newbee/api/shared/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([OrgMemberEntity])],
  providers: [OrgMemberService],
  exports: [OrgMemberService],
})
export class OrgMemberModule {}
