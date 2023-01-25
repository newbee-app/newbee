import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  CacheInterceptor,
  CacheModule,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@newbee/api/auth/feature';
import { JwtAuthGuard } from '@newbee/api/auth/util';
import { CsrfModule } from '@newbee/api/csrf/feature';
import { OrganizationModule } from '@newbee/api/organization/feature';
import {
  AppConfig,
  appEnvironmentVariablesSchema,
  ForbiddenExceptionFilter,
  GlobalExceptionFilter,
  ProxyThrottlerGuard,
} from '@newbee/api/shared/util';
import { UserOrganizationModule } from '@newbee/api/user-organization/feature';
import { UserSettingsModule } from '@newbee/api/user-settings/feature';
import { UserModule } from '@newbee/api/user/feature';
import { WinstonModule } from 'nest-winston';
import { default as appConfig } from '../environments/environment';

@Module({
  imports: [
    // 3rd party modules
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationSchema: appEnvironmentVariablesSchema,
      load: [appConfig],
    }),
    CacheModule.register({ isGlobal: true }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('logging', { infer: true }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('database', { infer: true }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('mailer', { infer: true }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('throttler', { infer: true }),
      inject: [ConfigService],
    }),

    // In-house modules
    AuthModule,
    CsrfModule,
    UserModule,
    UserSettingsModule,
    OrganizationModule,
    UserOrganizationModule,
  ],
  providers: [
    // App-level pipes
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },

    // App-level interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },

    // App-level guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ProxyThrottlerGuard,
    },

    // App-level exception filters
    // The exception filter specified last takes precedence in overlapping cases
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
  ],
})
export class AppModule {}
