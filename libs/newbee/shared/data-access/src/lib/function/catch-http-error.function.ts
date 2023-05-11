import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { internalServerError } from '@newbee/shared/util';
import { of } from 'rxjs';
import { HttpActions } from '../store';

/**
 * A helper function to be used by request-making effects to genearte a `clientError` action in the case of a `HttpErrorResponse`.
 *
 * @param err The error to turn into a `clientError`.
 * @param sortMessage A callback that takes in an error message and returns what part of the component it should target.
 * @returns An observable representing a `clientError`.
 */
export function catchHttpError(
  err: unknown,
  sortMessage: (message: string) => string
) {
  if (!(err instanceof HttpErrorResponse)) {
    const httpClientError: HttpClientError = {
      status: 500,
      messages: { misc: internalServerError },
    };
    return of(HttpActions.clientError({ httpClientError }));
  }

  const { status, error } = err;
  if (typeof error === 'string') {
    const httpClientError: HttpClientError = {
      status,
      messages: { misc: error },
    };
    return of(HttpActions.clientError({ httpClientError }));
  }

  if (!('message' in error)) {
    const httpClientError: HttpClientError = {
      status,
      messages: { misc: internalServerError },
    };
    return of(HttpActions.clientError({ httpClientError }));
  }

  const message: string | string[] = error.message;
  const httpClientError: HttpClientError = { status, messages: {} };
  if (typeof message === 'string') {
    httpClientError.messages[sortMessage(message)] = message;
    return of(HttpActions.clientError({ httpClientError }));
  }

  message.forEach((msg) => {
    httpClientError.messages[sortMessage(msg)] = msg;
  });
  return of(HttpActions.clientError({ httpClientError }));
}
