import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { unauthorizedError } from '@newbee/shared/util';
import type { Response } from 'express';
import { errors } from '../constant';

/**
 * A global exception filter to handle any `UnauthorizedException`.
 * Automatically adds a user-readable message.
 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: unauthorizedError,
      error: errors.unauthorized,
    });
  }
}
