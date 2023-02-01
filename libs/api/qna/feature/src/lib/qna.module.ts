import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OrgMemberModule } from '@newbee/api/org-member/feature';
import { OrganizationModule } from '@newbee/api/organization/feature';
import { QnaService } from '@newbee/api/qna/data-access';
import { QnaEntity } from '@newbee/api/shared/data-access';
import { TeamModule } from '@newbee/api/team/feature';
import { QnaController } from './qna.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([QnaEntity]),
    OrganizationModule,
    OrgMemberModule,
    TeamModule,
  ],
  providers: [QnaService],
  controllers: [QnaController],
  exports: [QnaService],
})
export class QnaModule {}
