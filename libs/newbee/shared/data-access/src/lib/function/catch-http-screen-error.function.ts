import { HttpErrorResponse } from '@angular/common/http';
import type { HttpScreenError } from '@newbee/newbee/shared/util';
import { internalServerError } from '@newbee/shared/util';
import { of } from 'rxjs';
import { HttpActions } from '../store';

/**
 * A helper function to be used by request-making effects to generate a `screenError` action in the case of an error.
 *
 * @param err The error to turn into an `HttpScreenError`.
 *
 * @returns An observable representing a `HttpScreenError`.
 */
export function catchHttpScreenError(err: unknown) {
  if (!(err instanceof HttpErrorResponse)) {
    const httpScreenError: HttpScreenError = {
      status: 500,
      message: internalServerError,
    };
    return of(HttpActions.screenError({ httpScreenError }));
  }

  const { status, error } = err;
  if (typeof error === 'string') {
    const httpScreenError: HttpScreenError = {
      status,
      message: error,
    };
    return of(HttpActions.screenError({ httpScreenError }));
  }

  if (!('message' in error)) {
    const httpScreenError: HttpScreenError = {
      status,
      message: internalServerError,
    };
    return of(HttpActions.screenError({ httpScreenError }));
  }

  const message: string | string[] = error.message;
  if (typeof message === 'string') {
    const httpScreenError: HttpScreenError = { status, message };
    return of(HttpActions.screenError({ httpScreenError }));
  }

  const httpScreenError: HttpScreenError = {
    status,
    message: message.join(', '),
  };
  return of(HttpActions.screenError({ httpScreenError }));
}
