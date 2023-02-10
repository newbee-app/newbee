import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  csrfTokenInvalidForbidden,
  internalServerError,
} from '@newbee/shared/util';
import { Response } from 'express';
import { AppConfig } from '../config';

/**
 * A global exception filter to handle any unhandled backend exceptions.
 * Automatically converts the value to an `InternalServerErrorException` with a message value of `internalServerError`.
 * Should go first when specifying exception filters.
 */
@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  /**
   * The logger to use to log anything in the exception filter.
   */
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * The error representing an invalid CSRF token.
   */
  private readonly invalidCsrfTokenError: Error;

  constructor(configService: ConfigService<AppConfig, true>) {
    super();
    this.invalidCsrfTokenError = configService.get(
      'csrf.invalidCsrfTokenError',
      { infer: true }
    );
  }

  override catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      super.catch(exception, host);
      return;
    }

    if (exception === this.invalidCsrfTokenError) {
      this.logger.error(exception);
      response.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: csrfTokenInvalidForbidden,
        error: 'Forbidden',
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: internalServerError,
      error: 'Internal Server Error',
    });
  }
}
