import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GrantService } from '@newbee/api/grant/data-access';
import { GrantEntity } from '@newbee/api/shared/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([GrantEntity])],
  providers: [GrantService],
  exports: [GrantService],
})
export class GrantModule {}
