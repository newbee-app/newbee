import { Logger, VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app/app.module';
import { doubleCsrfProtection } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Winston as the logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Set up Helmet
  app.use(
    helmet({
      // Add bits to the CSP to help with Angular XSS prevention
      contentSecurityPolicy: {
        directives: {
          'truted-types': ['angular'],
          'require-truted-types-for': [`'script'`],
        },
      },
    })
  );

  // Set up CORS
  app.enableCors();

  // Enable cookie-parser
  app.use(cookieParser(process.env['COOKIE_SECRET']));

  // Enable CSRF/XSRF protection
  app.use(doubleCsrfProtection);

  // Set up global versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  // Set up global api prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env['PORT'] || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
