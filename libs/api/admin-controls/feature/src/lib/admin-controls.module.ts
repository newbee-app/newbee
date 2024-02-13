import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdminControlsService } from '@newbee/api/admin-controls/data-access';
import { AdminControlsEntity } from '@newbee/api/shared/data-access';
import { UserInvitesModule } from '@newbee/api/user-invites/feature';
import { AdminControlsController } from './admin-controls.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([AdminControlsEntity]),
    UserInvitesModule,
  ],
  controllers: [AdminControlsController],
  providers: [AdminControlsService],
  exports: [AdminControlsService],
})
export class AdminControlsModule {}
