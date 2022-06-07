import { registerAs } from '@nestjs/config';

export interface AuthConfigInterface {
  magicLogin: {
    secret: string;
    callbackUrl: string;
  };
}

export default registerAs('auth', () => ({
  magicLogin: {
    secret: process.env['MAGIC_LOGIN_SECRET'],
    callbackUrl: process.env['MAGIC_LOGIN_CALLBACK_URL'],
  },
}));
