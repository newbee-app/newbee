import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import { AuthenticatorEntity } from '@newbee/api/shared/data-access';
import { UserChallengeModule } from '@newbee/api/user-challenge/feature';
import { AuthenticatorController } from './authenticator.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([AuthenticatorEntity]),
    UserChallengeModule,
  ],
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService],
  exports: [AuthenticatorService],
})
export class AuthenticatorModule {}
