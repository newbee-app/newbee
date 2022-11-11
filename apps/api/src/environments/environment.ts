import winston from 'winston';

export const environment = {
  production: false,
};

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
    type: 'postgres', // needs to be 'postgres' to work with enums, not 'cockroachdb'
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
  rpInfo: {
    name: process.env['APP_NAME'],
    id: process.env['APP_DOMAIN'],
    origin: process.env['APP_URL'],
  },
});
