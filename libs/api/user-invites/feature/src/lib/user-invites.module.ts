import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserInvitesEntity } from '@newbee/api/shared/data-access';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([UserInvitesEntity])],
  providers: [UserInvitesService],
  exports: [UserInvitesService],
})
export class UserInvitesModule {}
