import { registerAs } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { AppConfig, authJwtCookie } from '@newbee/api/shared/util';
import type { StrategyOptions as MagicLinkLoginStrategyOtions } from '@newbee/passport-magic-link-login';
import { magicLinkLogin } from '@newbee/shared/util';
import { StrategyOptions as JwtStrategyOptions } from 'passport-jwt';

/**
 * The structure of the auth module's config.
 */
export interface AuthConfig {
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

/**
 * The structure of the app config with the auth config.
 */
export interface AppAuthConfig extends AppConfig {
  /**
   * The auth config, which exists only in the auth module or modules that import the auth module.
   */
  auth: AuthConfig;
}

const tokenExpiration = '7d';
export default registerAs(
  'auth',
  (): AuthConfig => ({
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
      jwtFromRequest: (req) => req.signedCookies[authJwtCookie],
    },
  })
);
