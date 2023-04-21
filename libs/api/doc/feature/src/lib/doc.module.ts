import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DocService } from '@newbee/api/doc/data-access';
import { DocEntity } from '@newbee/api/shared/data-access';
import { DocController } from './doc.controller';

@Module({
  imports: [MikroOrmModule.forFeature([DocEntity])],
  providers: [DocService],
  controllers: [DocController],
  exports: [DocService],
})
export class DocModule {}
