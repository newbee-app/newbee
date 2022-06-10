import { registerAs } from '@nestjs/config';
import { StrategyOptions } from '@newbee/passport-magic-link-login';

export interface AuthConfigInterface {
  auth: {
    magicLinkLogin: StrategyOptions;
  };
}

export default registerAs('auth', () => ({
  magicLinkLogin: {
    secret: process.env['MAGIC_LINK_LOGIN_SECRET'],
    rootDomain: process.env['ROOT_DOMAIN'],
    verifyRoute: process.env['MAGIC_LINK_LOGIN_VERIFY_ROUTE'],
  },
}));
