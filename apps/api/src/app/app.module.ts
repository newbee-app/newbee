import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      cache: true,
      expandVariables: true,
      validationSchema: appEnvironmentVariablesSchema,
      load: [appConfig],
    }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
