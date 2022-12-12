import { registerAs } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StrategyOptions as MagicLinkLoginStrategyOtions } from '@newbee/passport-magic-link-login';
import { magicLinkLogin } from '@newbee/shared/util';
import {
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';

/**
 * The structure of the auth module's config.
 */
export interface AuthConfigInterface {
  /**
   * The options to feed into the `JwtModule`.
   */
  jwtModule: JwtModuleOptions;

  /**
   * The options to feed into the `MagicLinkLoginStrategy`.
   * The `sendMagicLink` property is omitted as it's defined apart from the `ConfigService`.
   */
  magicLinkLogin: Omit<MagicLinkLoginStrategyOtions, 'sendMagicLink'>;

  /**
   * The options to feed into the `JwtStrategy`.
   */
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
