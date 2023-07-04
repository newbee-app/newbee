import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { Strategy } from 'passport-strategy';

/**
 * The default expiration for the magic link.
 */
const defaultTokenExpiration = '5m';

/**
 * The function responsible for calling one of the Passport strategy's augmented functions, once the user verification is complete.
 *
 * @param err - The error object, if there is an error.
 * @param user - The user object, if verified.
 * @param info - An object to hold any additional information, if relevant.
 */
export type DoneCallback = (
  err: Error | null,
  user?: unknown,
  info?: unknown
) => void;

/**
 * The function responsible for validating the verified payload against the database.
 *
 * @param payload - The payload to validate.
 * @param done - The function to call after the validation is complete.
 */
export type VerifyFunction = (payload: Payload, done: DoneCallback) => void;

/**
 * The function responsible for sending the magic link to the user's email.
 *
 * @param payload - The payload that will be turned into the JWT attached to the magic link.
 * @param link - The magic link to be sent in the email.
 * @param code - The JWT ID or code, used to identify which magic link is associated with which magic link login attempt.
 */
export type SendMagicLinkFunction = (
  payload: Payload,
  link: string,
  code: string
) => Promise<void>;

/**
 * All of the options used to configure the strategy.
 */
export interface StrategyOptions {
  /**
   * The secret to be used for encryption purposes.
   */
  secret: string;

  /**
   * The base part of the magic link, which includes everything before the query string.
   *
   * @example
   * 'https://example.com/verify'
   */
  verifyLink: string;

  /**
   * Your implementation of how the magic link should be sent.
   */
  sendMagicLink: SendMagicLinkFunction;

  /**
   * The name that should be used for the strategy in Passport.
   * Defaults to 'magic-link-login', if not specified.
   */
  name?: string;

  /**
   * The sign options to be fed into the `jsonwebtoken` package.
   */
  jwtSignOptions?: jwt.SignOptions;

  /**
   * The verify options to be fed into the `jsonwebtoken` package.
   */
  jwtVerifyOptions?: jwt.VerifyOptions;
}

/**
 * The payload that's bundled as a part of the JWT.
 */
export interface Payload {
  /**
   * The user's email.
   */
  email: string;

  /**
   * Any other values the end-user wants to define to aid in backend validation.
   */
  [key: string]: unknown;
}

/**
 * The MagicLinkLoginStrategy to be used by Passport.
 */
export class MagicLinkLoginStrategy extends Strategy {
  /**
   * The secret to be used for encryption purposes.
   */
  private readonly secret: string;

  /**
   * The base part of the magic link, which includes everything before the query string.
   *
   * @example
   * 'https://example.com/verify'
   */
  private readonly verifyLink: string;

  /**
   * Your implementation of how the magic link should be sent.
   */
  private readonly sendMagicLink: SendMagicLinkFunction;

  /**
   * The name that should be used for the strategy in Passport.
   * Defaults to 'magic-link-login', if not specified.
   */
  readonly name: string = 'magic-link-login';

  /**
   * The sign options to be fed into the `jsonwebtoken` package.
   */
  private readonly jwtSignOptions: jwt.SignOptions = {
    expiresIn: defaultTokenExpiration,
  };

  /**
   * The verify options to be fed into the `jsonwebtoken` package.
   */
  private readonly jwtVerifyOptions: jwt.VerifyOptions = {
    maxAge: defaultTokenExpiration,
  };

  /**
   * @param options The options to build the strategy.
   * @param verify Called after the JWT of the magic link has already been verified. Checks if the verified JWT's payload can be used to find a registered user in the database.
   */
  constructor(
    options: StrategyOptions,
    private readonly verify: VerifyFunction
  ) {
    super();

    this.secret = options.secret;
    this.verifyLink = options.verifyLink;
    this.sendMagicLink = options.sendMagicLink;

    if (options.name) {
      this.name = options.name;
    }
    if (options.jwtSignOptions) {
      this.jwtSignOptions = {
        ...this.jwtSignOptions,
        ...options.jwtSignOptions,
      };
    }
    if (options.jwtVerifyOptions) {
      this.jwtVerifyOptions = {
        ...this.jwtVerifyOptions,
        ...options.jwtVerifyOptions,
      };
    }
  }

  /**
   * Verifies the JWT attached to the magic link and calls the strategy's `verify` function to check if the JWT's payload can be used to find a registered user in the database.
   *
   * @param req The Express request to authenticate.
   */
  override authenticate(req: Request): void {
    try {
      // No need to check the result of jwt.verify more strictly with something like a Joi schema because we create the payload when the token is created, so we know its structure and can guarantee type safety
      const payload = jwt.verify(
        req.body['token'] as string,
        this.secret,
        this.jwtVerifyOptions
      ) as Payload;

      const verified: DoneCallback = (
        err: Error | null,
        user?: unknown,
        info?: unknown
      ): void => {
        if (err) {
          this.error(err);
        } else if (!user) {
          this.fail(info, 401);
        } else {
          this.success(user, info);
        }
      };

      this.verify(payload, verified);
    } catch (err: unknown) {
      this.error(err as Error);
    }
  }

  /**
   * Packages the payload as a JWT and calls the strategy's `sendMagicLink` function to send the magic link to the user's email.
   *
   * @param payload The payload to sign as a JWT and attach to the magic link.
   * @returns The ID of the JWT associated with the magic link.
   */
  async send(payload: Payload): Promise<string> {
    if (!payload.email) {
      throw new TypeError(`'email' is a required property`);
    }

    const jwtid = (Math.floor(Math.random() * 90000) + 10000).toString();
    const token = jwt.sign(payload, this.secret, {
      ...this.jwtSignOptions,
      jwtid,
    });

    await this.sendMagicLink(payload, `${this.verifyLink}/${token}`, jwtid);
    return jwtid;
  }
}
