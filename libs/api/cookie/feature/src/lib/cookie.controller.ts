import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@newbee/api/auth/data-access';
import { EntityService } from '@newbee/api/shared/data-access';
import { AppConfig, Public, authJwtCookie } from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import { BaseCsrfTokenAndDataDto, Keyword } from '@newbee/shared/util';
import type { CsrfTokenCreator } from 'csrf-csrf';
import type { Request, Response } from 'express';

/**
 * The API endpoints for setting up the user's cookies and initial load of data.
 */
@Controller({ path: Keyword.Cookie, version: apiVersion.cookie })
export class CookieController {
  /**
   * The logger to use to log anything in the controller.
   */
  private readonly logger = new Logger(CookieController.name);

  /**
   * Generates a CSRF token as a string.
   */
  private readonly generateToken: CsrfTokenCreator;

  constructor(
    configService: ConfigService<AppConfig, true>,
    private readonly entityService: EntityService,
    private readonly authService: AuthService,
  ) {
    this.generateToken = configService.get('csrf.generateToken', {
      infer: true,
    });
  }

  /**
   * A publicly-accessible API route for creating a new CSRF token for a user and getting them their initial data.
   *
   * @param req The request for a new CSRF token and initial data.
   * @param res The response to attach the CSRF token to.
   *
   * @returns The new CSRF token (to be appended to future headers) and user information, if applicable.
   */
  @Public()
  @Get()
  async initCookies(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BaseCsrfTokenAndDataDto> {
    this.logger.log('Init cookies request received');
    const csrfToken = this.generateToken(req, res, true);
    this.logger.log(`CSRF token generated: ${csrfToken}`);

    const authToken: string | undefined = req.signedCookies[authJwtCookie];
    if (!authToken) {
      return { csrfToken, userRelation: null };
    }

    const user = await this.authService.verifyAuthToken(authToken);
    if (!user) {
      return { csrfToken, userRelation: null };
    }

    const userRelation = await this.entityService.createUserRelation(user);
    return { csrfToken, userRelation };
  }
}
