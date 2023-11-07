import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AuthService,
  JwtStrategy,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { AppAuthConfig, authConfig } from '@newbee/api/auth/util';
import { AuthenticatorModule } from '@newbee/api/authenticator/feature';
import { UserModule } from '@newbee/api/user/feature';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<AppAuthConfig, true>) =>
        configService.get('auth.jwtModule', { infer: true }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthenticatorModule,
  ],
  controllers: [AuthController],
  providers: [MagicLinkLoginStrategy, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
