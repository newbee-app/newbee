import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { Strategy } from 'passport-strategy';

const defaultTokenExpiration = '1h';

export type DoneCallback = (
  err?: Error,
  user?: unknown,
  info?: unknown
) => void;

export type VerifyFunction = (
  payload: ValidatePayload,
  done: DoneCallback
) => void;

export type SendMagicLinkFunction = (
  payload: SendPayload,
  link: string,
  code: string
) => Promise<void>;

export interface StrategyOptions {
  secret: string;
  verifyLink: string;
  sendMagicLink: SendMagicLinkFunction;

  name?: string;
  jwtSignOptions?: jwt.SignOptions;
  jwtVerifyOptions?: jwt.VerifyOptions;
}

export interface ValidatePayload {
  email: string;
  [key: string]: unknown | undefined;
}

export interface SendPayload {
  email: string;
  [key: string]: unknown | undefined;
}

export class MagicLinkLoginStrategy extends Strategy {
  private readonly secret: string;
  private readonly verifyLink: string;
  private readonly sendMagicLink: SendMagicLinkFunction;

  readonly name: string = 'magic-link-login';
  private readonly jwtSignOptions: jwt.SignOptions = {
    expiresIn: defaultTokenExpiration,
  };
  private readonly jwtVerifyOptions: jwt.VerifyOptions = {
    maxAge: defaultTokenExpiration,
  };

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

  override authenticate(req: Request): void {
    try {
      // No need to check the result of jwt.verify more strictly with something like a Joi schema because we create the payload when the token is created, so we know its structure and can guarantee type safety
      const payload = jwt.verify(
        req.query['token'] as string,
        this.secret,
        this.jwtVerifyOptions
      ) as ValidatePayload;

      const verified: DoneCallback = (
        err?: Error,
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

  async send(payload: SendPayload): Promise<void> {
    if (!payload.email) {
      throw new TypeError(`'email' is a required property`);
    }

    const jwtid = (Math.floor(Math.random() * 90000) + 10000).toString();
    const token = jwt.sign(payload, this.secret, {
      ...this.jwtSignOptions,
      jwtid,
    });

    try {
      await this.sendMagicLink(
        payload,
        `${this.verifyLink}?token=${token}`,
        jwtid
      );
    } catch (err: unknown) {
      throw new EvalError(`Failed to send magic link: ${err}`);
    }
  }
}
