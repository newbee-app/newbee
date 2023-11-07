import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import { AuthenticatorEntity } from '@newbee/api/shared/data-access';
import { UserModule } from '@newbee/api/user/feature';
import { AuthenticatorController } from './authenticator.controller';

@Module({
  imports: [MikroOrmModule.forFeature([AuthenticatorEntity]), UserModule],
  controllers: [AuthenticatorController],
  providers: [AuthenticatorService],
  exports: [AuthenticatorService],
})
export class AuthenticatorModule {}
