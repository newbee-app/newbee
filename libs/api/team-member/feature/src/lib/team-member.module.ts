import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamMemberEntity } from '@newbee/api/shared/data-access';
import { TeamMemberService } from '@newbee/api/team-member/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([TeamMemberEntity])],
  providers: [TeamMemberService],
  exports: [TeamMemberService],
})
export class TeamMemberModule {}
