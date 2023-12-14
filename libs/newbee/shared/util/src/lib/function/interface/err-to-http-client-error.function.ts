import { HttpErrorResponse } from '@angular/common/http';
import { internalServerError, valueOrArray } from '@newbee/shared/util';
import type { HttpClientError } from '../../interface';

/**
 * Takes in an unknown error object and converts it into an HttpClientError.
 *
 * @param err The error object to convert, could be of any type.
 * @param sortMessage An optional parameter that specifies what key the error messages should be assigned to, if it will turn the error messages into an object.
 *
 * @returns The error as an HttpClientError.
 */
export function errToHttpClientError(
  err: unknown,
  sortMessage?: (message: string) => string,
): HttpClientError {
  let status = 500;
  let message: string | string[] = internalServerError;

  if (err instanceof HttpErrorResponse) {
    status = err.status;
    message = unknownErrToMsg(err.error);
  } else {
    message = unknownErrToMsg(err);
  }

  if (typeof message === 'string') {
    return {
      status,
      messages: sortMessage ? { [sortMessage(message)]: message } : message,
    };
  }

  // message is string[]
  return {
    status,
    messages: sortMessage
      ? message.reduce(
          (msgs, msg) => {
            const prev = msgs[sortMessage(msg)];
            msgs[sortMessage(msg)] = valueOrArray(msg, prev);
            return msgs;
          },
          {} as { [key: string]: string | string[] },
        )
      : message,
  };
}

/**
 * Helper function that takes in an unknown error and converts it to an error message.
 *
 * @param err The unknown error to convert.
 *
 * @returns The error message associated with the unknown error.
 */
function unknownErrToMsg(err: unknown): string | string[] {
  if (
    typeof err === 'string' ||
    (Array.isArray(err) && err.every((item) => typeof item === 'string'))
  ) {
    return err as string | string[];
  } else if (typeof err === 'object' && err && 'message' in err) {
    return unknownErrToMsg(err.message);
  }

  return internalServerError;
}
