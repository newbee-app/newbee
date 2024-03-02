import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { forbiddenError } from '@newbee/shared/util';
import type { Response } from 'express';
import { errors } from '../constant';

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
      message: [errors.forbidden, FORBIDDEN_MESSAGE].includes(message)
        ? forbiddenError
        : message,
      error: errors.forbidden,
    });
  }
}
