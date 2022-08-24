import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { StrategyOptions as MagicLinkLoginStrategyOtions } from '@newbee/passport-magic-link-login';
import { magicLinkLogin } from '@newbee/shared/util';
import {
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';

export interface AuthConfigInterface {
  auth: {
    jwtModule: JwtModuleOptions;
    magicLinkLogin: MagicLinkLoginStrategyOtions;
    jwtStrategy: JwtStrategyOptions;
  };
}

export default registerAs('auth', () => ({
  jwtModule: {
    secret: process.env['JWT_SECRET'],
  },
  magicLinkLogin: {
    secret: process.env['JWT_SECRET'],
    verifyLink: process.env['MAGIC_LINK_LOGIN_VERIFY_LINK'],
    name: magicLinkLogin,
  },
  jwtStrategy: {
    secretOrKey: process.env['JWT_SECRET'],
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
}));
