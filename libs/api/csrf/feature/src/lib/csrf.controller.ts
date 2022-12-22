import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, Public } from '@newbee/api/shared/util';
import type { BaseCsrfTokenDto } from '@newbee/shared/data-access';
import { csrfVersion } from '@newbee/shared/data-access';
import type { CsrfTokenCreator } from 'csrf-csrf';
import type { Request, Response } from 'express';

@Controller({ path: 'csrf', version: csrfVersion })
export class CsrfController {
  private readonly logger = new Logger(CsrfController.name);
  private readonly generateToken: CsrfTokenCreator;

  constructor(configService: ConfigService<AppConfig, true>) {
    this.generateToken = configService.get('csrf.generateToken', {
      infer: true,
    });
  }

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
