import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdminControlsService } from '@newbee/api/admin-controls/data-access';
import { SearchModule } from '@newbee/api/search/feature';
import { AdminControlsEntity } from '@newbee/api/shared/data-access';
import { UserModule } from '@newbee/api/user/feature';
import { WaitlistMemberModule } from '@newbee/api/waitlist-member/feature';
import { AdminControlsController } from './admin-controls.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([AdminControlsEntity]),
    SearchModule,
    UserModule,
    WaitlistMemberModule,
  ],
  controllers: [AdminControlsController],
  providers: [AdminControlsService],
  exports: [AdminControlsService],
})
export class AdminControlsModule {}
