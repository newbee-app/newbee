import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberModule } from '@newbee/api/org-member/feature';
import { DocEntity } from '@newbee/api/shared/data-access';
import { TeamMemberModule } from '@newbee/api/team-member/feature';
import { TeamModule } from '@newbee/api/team/feature';
import { DocController } from './doc.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([DocEntity]),
    OrgMemberModule,
    TeamMemberModule,
    TeamModule,
  ],
  providers: [DocService],
  controllers: [DocController],
  exports: [DocService],
})
export class DocModule {}
