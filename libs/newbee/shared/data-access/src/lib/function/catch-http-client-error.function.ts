import { errToHttpClientError } from '@newbee/newbee/shared/util';
import { of } from 'rxjs';
import { HttpActions } from '../store';

/**
 * A helper function to be used by request-making effects to genearte a `clientError` action in the case of a `HttpErrorResponse`.
 *
 * @param err The error to turn into a `clientError`.
 * @param sortMessage An optional callback that takes in an error message and returns what part of the component it should target.
 *
 * @returns An observable calling `clientError`.
 */
export function catchHttpClientError(
  err: unknown,
  sortMessage?: (message: string) => string,
) {
  return of(
    HttpActions.clientError({
      httpClientError: errToHttpClientError(err, sortMessage),
    }),
  );
}
