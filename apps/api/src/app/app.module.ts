import { MailerModule } from '@nestjs-modules/mailer';
import {
  CacheInterceptor,
  CacheModule,
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@newbee/api/auth/feature';
import { UserSettingsModule } from '@newbee/api/user-settings/feature';
import { UserModule } from '@newbee/api/user/feature';
import { WinstonModule } from 'nest-winston';
import {
  AppConfigInterface,
  appEnvironmentVariablesSchema,
  default as appConfig,
} from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationSchema: appEnvironmentVariablesSchema,
      load: [appConfig],
    }),
    CacheModule.register({ isGlobal: true }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfigInterface, true>) =>
        configService.get('logging', { infer: true }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfigInterface, true>) =>
        configService.get('database', { infer: true }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfigInterface, true>) =>
        configService.get('mailer', { infer: true }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    UserSettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
  ],
})
export class AppModule {}
