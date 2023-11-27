import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { QnaService } from '@newbee/api/qna/data-access';
import { QnaEntity } from '@newbee/api/shared/data-access';
import { TeamMemberModule } from '@newbee/api/team-member/feature';
import { TeamModule } from '@newbee/api/team/feature';
import { QnaController } from './qna.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([QnaEntity]),
    TeamModule,
    TeamMemberModule,
  ],
  providers: [QnaService],
  controllers: [QnaController],
  exports: [QnaService],
})
export class QnaModule {}
