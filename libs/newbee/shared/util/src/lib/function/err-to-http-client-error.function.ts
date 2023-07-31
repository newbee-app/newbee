import { HttpErrorResponse } from '@angular/common/http';
import { internalServerError, valueOrArray } from '@newbee/shared/util';
import type { HttpClientError } from '../interface';

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
  sortMessage?: (message: string) => string
): HttpClientError {
  if (!(err instanceof HttpErrorResponse)) {
    return { status: 500, messages: internalServerError };
  }

  const { status, error } = err;
  if (typeof error === 'string') {
    return {
      status,
      messages: sortMessage ? { [sortMessage(error)]: error } : error,
    };
  }

  if (!('message' in error)) {
    return { status, messages: internalServerError };
  }

  const message: string | string[] = error.message;
  if (typeof message === 'string') {
    return {
      status,
      messages: sortMessage ? { [sortMessage(error)]: message } : message,
    };
  }

  // message is string[]
  return {
    status,
    messages: sortMessage
      ? message.reduce((msgs, msg) => {
          const prev = msgs[sortMessage(msg)];
          msgs[sortMessage(msg)] = valueOrArray(msg, prev);
          return msgs;
        }, {} as { [key: string]: string | string[] })
      : message,
  };
}
