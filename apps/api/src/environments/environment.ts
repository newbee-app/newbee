import Joi from 'joi';
import winston from 'winston';

export const environment = {
  production: false,
};

export interface AppConfigInterface {
  logging: winston.LoggerOptions;
}

export const appEnvironmentVariablesSchema = Joi.object({
  PORT: Joi.number(),
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
});
