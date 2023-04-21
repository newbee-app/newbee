import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Public } from '@newbee/api/shared/util';
import {
  BaseCsrfTokenDto,
  csrfUrl,
  csrfVersion,
} from '@newbee/shared/data-access';
import type { CsrfTokenCreator } from 'csrf-csrf';
import type { Request, Response } from 'express';

/**
 * The controller that provides API route for generating CSRF tokens.
 */
@Controller({ path: csrfUrl, version: csrfVersion })
export class CsrfController {
  /**
   * The logger to use to log anything in the controller.
   */
  private readonly logger = new Logger(CsrfController.name);

  /**
   * Generates a CSRF token as a string.
   */
  private readonly generateToken: CsrfTokenCreator;

  constructor(configService: ConfigService<AppConfig, true>) {
    this.generateToken = configService.get('csrf.generateToken', {
      infer: true,
    });
  }

  /**
   * A publicly-accessible API route for creating a new CSRF token for a user.
   *
   * @param req The request for a new CSRF token.
   * @param res The response to attach the CSRF token to.
   *
   * @returns The new CSRF token, to be appended to future request headers.
   */
  @Public()
  @Get()
  createToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): BaseCsrfTokenDto {
    this.logger.log('Create CSRF token request received');
    const csrfToken = this.generateToken(res, req);
    this.logger.log(`CSRF token generated: ${csrfToken}`);
    return { csrfToken };
  }
}
