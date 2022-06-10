import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MagicLinkLoginStrategy } from '@newbee/api/auth/data-access';
import { authConfig } from '@newbee/api/auth/util';
import { UserModule } from '@newbee/api/user/feature';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, PassportModule, ConfigModule.forFeature(authConfig)],
  controllers: [AuthController],
  providers: [MagicLinkLoginStrategy],
  exports: [],
})
export class AuthModule {}
