import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import type { MailerOptions } from '@nestjs-modules/mailer';
import type { ThrottlerModuleOptions } from '@nestjs/throttler';
import type { SolrCliOptions } from '@newbee/solr-cli';
import type { CsrfTokenCreator } from 'csrf-csrf';
import type { CookieOptions } from 'express';
import Joi from 'joi';
import winston from 'winston';

/**
 * The structure of the app-wide config.
 */
export interface AppConfig {
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
   * The options to feed into the `ThrottlerModule` for request throttling.
   */
  throttler: ThrottlerModuleOptions;

  /**
   * The options to feed into the `SolrModule` for interacting with Solr.
   */
  solr: SolrCliOptions;

  /**
   * Relaying Party information for use in WebAuthn.
   */
  rpInfo: {
    /**
     * The app's name.
     */
    name: string;

    /**
     * The app's globally unique ID (domain).
     */
    id: string;

    /**
     * The app's URL, including scheme.
     */
    origin: string;
  };

  /**
   * Useful information for setting up CSRF prevention.
   */
  csrf: {
    /**
     * The function to call to generate a CSRF token.
     */
    generateToken: CsrfTokenCreator;

    /**
     * The error that's passed whenever a CSRF error occurs.
     */
    invalidCsrfTokenError: Error;

    /**
     * The options to use for generating the CSRF token cookie.
     */
    cookieOptions: CookieOptions;
  };
}

/**
 * All of the environment variables we use in NewBee, validated using the `joi` library.
 */
export const appEnvironmentVariablesSchema = Joi.object({
  // API port
  PORT: Joi.number(),

  // App information
  APP_NAME: Joi.string().required(),
  APP_DOMAIN: Joi.string().required(),
  APP_URL: Joi.string().required(),

  // PostgreSQL
  POSTGRES_DB_NAME: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  // Cookies
  COOKIE_SECRET: Joi.string().required(),

  // AUTH: Magic Link Login Strategy
  MAGIC_LINK_LOGIN_VERIFY_LINK: Joi.string().required(),

  // SMTP
  SMTP_HOST: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  SMTP_DEFAULT_FROM: Joi.string().required(),

  // Solr
  SOLR_URL: Joi.string().required(),
  SOLR_USERNAME: Joi.string().required(),
  SOLR_PASSWORD: Joi.string().required(),
});
