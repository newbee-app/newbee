import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChallengeEntity } from '@newbee/api/shared/data-access';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';

@Module({
  imports: [TypeOrmModule.forFeature([UserChallengeEntity])],
  providers: [UserChallengeService],
  exports: [TypeOrmModule, UserChallengeService],
})
export class UserChallengeModule {}
