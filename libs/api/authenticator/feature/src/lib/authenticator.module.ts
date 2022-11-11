import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import { AuthenticatorEntity } from '@newbee/api/shared/data-access';
import { UserChallengeModule } from '@newbee/api/user-challenge/feature';
import { AuthenticatorController } from './authenticator.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthenticatorEntity]),
    UserChallengeModule,
  ],
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService],
  exports: [TypeOrmModule, AuthenticatorService],
})
export class AuthenticatorModule {}
