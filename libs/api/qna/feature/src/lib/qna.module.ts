import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { QnaService } from '@newbee/api/qna/data-access';
import { QnaEntity } from '@newbee/api/shared/data-access';
import { QnaController } from './qna.controller';

@Module({
  imports: [MikroOrmModule.forFeature([QnaEntity])],
  providers: [QnaService],
  controllers: [QnaController],
  exports: [QnaService],
})
export class QnaModule {}
