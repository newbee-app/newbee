import { Logger } from '@nestjs/common';
import { AppConfig } from '@newbee/api/shared/util';
import winston from 'winston';

export const environment = {
  production: false,
};

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
    clientUrl: process.env['COCKROACHDB_URL'] as string,
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
});
