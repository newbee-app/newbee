import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';
import {
  emailUnverifiedForbiddenError,
  forbiddenError,
} from '@newbee/shared/util';
import type { Response } from 'express';

/**
 * A global exception filter to handle any `ForbiddenException` thrown by the JWT strategy.
 * Automatically adds a user-readable message.
 */
@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const { message } = exception;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: [forbiddenError, emailUnverifiedForbiddenError].includes(message)
        ? message
        : forbiddenError,
      error: 'Forbidden',
    });
  }
}
