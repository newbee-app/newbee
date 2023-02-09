import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { internalServerError } from '@newbee/shared/util';
import { Response } from 'express';

/**
 * A global exception filter to handle any unhandled backend exceptions.
 * Automatically converts the value to an `InternalServerErrorException` with a message value of `internalServerError`.
 * Should go first when specifying exception filters.
 */
@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      super.catch(exception, host);
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: internalServerError,
      error: 'Internal Server Error',
    });
  }
}
