import {
  errToHttpClientError,
  httpClientErrorToToast,
} from '@newbee/newbee/shared/util';
import { of } from 'rxjs';
import { ToastActions } from '../store';

/**
 * A helper function to be used by request-making effects to generate an `addToast` action in the case of a `HttpErrorResponse`.
 *
 * @param err The error to turn into an `addToast`.
 *
 * @returns An observable calling `addToast`.
 */
export function catchToastError(err: unknown) {
  return of(
    ToastActions.addToast({
      toast: httpClientErrorToToast(errToHttpClientError(err)),
    }),
  );
}
