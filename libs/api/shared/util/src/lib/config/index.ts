import { MailerOptions } from '@nestjs-modules/mailer';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import winston from 'winston';

export interface AppConfigInterface {
  logging: winston.LoggerOptions;
  database: TypeOrmModuleOptions;
  mailer: MailerOptions;
  rpInfo: {
    name: string;
    id: string;
    origin: string;
  };
}

export const appEnvironmentVariablesSchema = Joi.object({
  // API port
  PORT: Joi.number(),

  // App information
  APP_NAME: Joi.string().required(),
  APP_DOMAIN: Joi.string().required(),
  APP_URL: Joi.string().required(),

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
