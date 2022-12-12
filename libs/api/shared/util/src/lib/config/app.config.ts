import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import type { MailerOptions } from '@nestjs-modules/mailer';
import Joi from 'joi';
import winston from 'winston';
import type { AuthConfigInterface } from './auth.config';

/**
 * The structure of the app-wide config.
 */
export interface AppConfigInterface {
  /**
   * The options to feed into the `WinstonModule` for logging through `winston`.
   */
  logging: winston.LoggerOptions;

  /**
   * The options to feed into the `MikroOrmModule` for database management with `mikro-orm`.
   */
  database: MikroOrmModuleOptions;

  /**
   * The options to feed into the `MailerModule` for sending emails in the app through `nodemailer`.
   */
  mailer: MailerOptions;

  /**
   * Relaying Party information for use in WebAuthn.
   */
  rpInfo: {
    name: string;
    id: string;
    origin: string;
  };

  /**
   * The config for the `auth` module. It's optional as it should only be defined and used within the `auth` module.
   */
  auth?: AuthConfigInterface;
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
