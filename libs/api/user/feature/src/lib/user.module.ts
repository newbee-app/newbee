import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserEntity } from '@newbee/api/shared/data-access';
import { UserInvitesModule } from '@newbee/api/user-invites/feature';
import { UserService } from '@newbee/api/user/data-access';
import { UserController } from './user.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), UserInvitesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
