import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserChallengeEntity } from '@newbee/api/shared/data-access';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';

@Module({
  imports: [MikroOrmModule.forFeature([UserChallengeEntity])],
  providers: [UserChallengeService],
  exports: [UserChallengeService],
})
export class UserChallengeModule {}
