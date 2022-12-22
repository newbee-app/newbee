import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  CacheInterceptor,
  CacheModule,
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@newbee/api/auth/feature';
import { JwtAuthGuard } from '@newbee/api/auth/util';
import { CsrfModule } from '@newbee/api/csrf/feature';
import {
  AppConfig,
  appEnvironmentVariablesSchema,
} from '@newbee/api/shared/util';
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

    // In-house modules
    AuthModule,
    CsrfModule,
    UserModule,
    UserSettingsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
