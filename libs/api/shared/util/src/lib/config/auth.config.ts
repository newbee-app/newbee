import { registerAs } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StrategyOptions as MagicLinkLoginStrategyOtions } from '@newbee/passport-magic-link-login';
import { magicLinkLogin } from '@newbee/shared/util';
import {
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';

export interface AuthConfigInterface {
  jwtModule: JwtModuleOptions;
  magicLinkLogin: Omit<MagicLinkLoginStrategyOtions, 'sendMagicLink'>;
  jwtStrategy: JwtStrategyOptions;
}

const tokenExpiration = '7d';
export default registerAs(
  'auth',
  (): AuthConfigInterface => ({
    jwtModule: {
      secret: process.env['JWT_SECRET'] as string,
      signOptions: {
        expiresIn: tokenExpiration,
      },
      verifyOptions: {
        maxAge: tokenExpiration,
      },
    },
    magicLinkLogin: {
      secret: process.env['JWT_SECRET'] as string,
      verifyLink: process.env['MAGIC_LINK_LOGIN_VERIFY_LINK'] as string,
      name: magicLinkLogin,
    },
    jwtStrategy: {
      secretOrKey: process.env['JWT_SECRET'] as string,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
  })
);
