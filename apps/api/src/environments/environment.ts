import { MailerOptions } from '@nestjs-modules/mailer';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import winston from 'winston';

export const environment = {
  production: false,
};

export interface AppConfigInterface {
  logging: winston.LoggerOptions;
  database: TypeOrmModuleOptions;
  mailer: MailerOptions;
}

export const appEnvironmentVariablesSchema = Joi.object({
  // API port
  PORT: Joi.number(),

  // CockroachDB
  COCKROACHDB_URL: Joi.string().required(),
  COCKROACHDB_CLUSTER: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  // AUTH: Magic Link Login Strategy
  MAGIC_LINK_LOGIN_VERIFY_LINK: Joi.string().required(),

  // SMTP
  SMTP_HOST: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  SMTP_DEFAULT_FROM: Joi.string().required(),
});

export default () => ({
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
    type: 'postgres',
    url: process.env['COCKROACHDB_URL'],
    ssl: true,
    extra: {
      options: `--cluster=${process.env['COCKROACHDB_CLUSTER']}`,
    },
    autoLoadEntities: true,
  },
  mailer: {
    transport: `smtps://${process.env['SMTP_USERNAME']}:${process.env['SMTP_PASSWORD']}@${process.env['SMTP_HOST']}`,
    defaults: {
      from: process.env['SMTP_DEFAULT_FROM'],
    },
  },
});
