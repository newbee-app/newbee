import { Global, Module } from '@nestjs/common';
import { EntityService } from '@newbee/api/shared/data-access';

@Global()
@Module({
  providers: [EntityService],
  exports: [EntityService],
})
export class UtilModule {}
