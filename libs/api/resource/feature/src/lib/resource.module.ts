import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ResourceService } from '@newbee/api/resource/data-access';
import { ResourceEntity } from '@newbee/api/shared/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([ResourceEntity])],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
