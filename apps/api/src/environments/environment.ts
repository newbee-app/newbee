import { Logger } from '@nestjs/common';
import { AppConfig } from '@newbee/api/shared/util';
import { doubleCsrf } from 'csrf-csrf';
import type { CookieOptions } from 'express';
import winston from 'winston';

export const environment = {
  production: false,
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  path: '/',
  sameSite: 'lax',
};

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: (req) => req?.get('Session-Secret') ?? '',
  cookieName: 'CSRF-TOKEN',
  cookieOptions,
  getTokenFromRequest: (req) => req.get('X-CSRF-TOKEN'),
});
export { doubleCsrfProtection };

const logger = new Logger('MikroORM');
export default (): AppConfig => ({
  logging: {
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: {
      service: 'api',
    },
    transports: [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  },
  database: {
    type: 'postgresql',
    dbName: process.env['POSTGRES_DB_NAME'] as string,
    user: process.env['POSTGRES_USER'] as string,
    password: process.env['POSTGRES_PASSWORD'] as string,
    forceUtcTimezone: true,
    autoLoadEntities: true,
    logger: logger.log.bind(logger),
  },
  mailer: {
    transport: `smtps://${process.env['SMTP_USERNAME']}:${process.env['SMTP_PASSWORD']}@${process.env['SMTP_HOST']}`,
    defaults: {
      from: process.env['SMTP_DEFAULT_FROM'],
    },
  },
  rpInfo: {
    name: process.env['APP_NAME'] as string,
    id: process.env['APP_DOMAIN'] as string,
    origin: process.env['APP_URL'] as string,
  },
  csrf: {
    generateToken,
    cookieOptions,
  },
});
