import { errToHttpScreenError } from '@newbee/newbee/shared/util';
import { of } from 'rxjs';
import { HttpActions } from '../store';

/**
 * A helper function to be used by request-making effects to generate a `screenError` action in the case of an error.
 *
 * @param err The error to turn into an `HttpScreenError`.
 *
 * @returns An observable calling screenError.
 */
export function catchHttpScreenError(err: unknown) {
  return of(
    HttpActions.screenError({ httpScreenError: errToHttpScreenError(err) })
  );
}
