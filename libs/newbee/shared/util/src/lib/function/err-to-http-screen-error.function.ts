import { HttpErrorResponse } from '@angular/common/http';
import { arrayToBullets, internalServerError } from '@newbee/shared/util';
import type { HttpScreenError } from '../interface';

/**
 * Takes in an unknown error object and converts it into an HttpScreenError.
 *
 * @param err The error object to convert, could be of any type.
 *
 * @returns The error as an HttpScreenError.
 */
export function errToHttpScreenError(err: unknown): HttpScreenError {
  if (!(err instanceof HttpErrorResponse)) {
    return { status: 500, message: internalServerError };
  }

  const { status, error } = err;
  if (typeof error === 'string') {
    return { status, message: error };
  }

  if (!('message' in error)) {
    return { status, message: internalServerError };
  }

  const message: string | string[] = error.message;
  if (typeof message === 'string') {
    return { status, message };
  }

  return { status, message: arrayToBullets(message) };
}
