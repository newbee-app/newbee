import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AuthService,
  JwtStrategy,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { authConfig, AuthConfigInterface } from '@newbee/api/auth/util';
import { UserModule } from '@newbee/api/user/feature';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      useFactory: async (
        configService: ConfigService<AuthConfigInterface, true>
      ) => configService.get('auth.jwtModule', { infer: true }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [MagicLinkLoginStrategy, AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
