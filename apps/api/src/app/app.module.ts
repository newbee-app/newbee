import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
