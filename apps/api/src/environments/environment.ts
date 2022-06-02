import Joi from 'joi';

export const environment = {
  production: false,
};

export const appEnvironmentVariablesSchema = Joi.object({});

export default () => ({});
