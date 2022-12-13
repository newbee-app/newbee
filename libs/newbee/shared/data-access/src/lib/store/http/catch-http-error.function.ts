import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { of } from 'rxjs';
import { HttpActions } from './http.actions';

/**
 * A helper function to feed into the `catchError` function of request-making effects to genearte a `clientError` action in the case of a `HttpErrorResponse`.
 *
 * @param err The `HttpErrorResponse` to turn into a `clientError`.
 * @returns An observable representing a `clientError`.
 */
export function catchHttpError(err: HttpErrorResponse) {
  const { status, error } = err;
  const httpClientError: HttpClientError = { status, error };
  return of(HttpActions.clientError({ httpClientError }));
}
