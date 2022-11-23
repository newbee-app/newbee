import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { of } from 'rxjs';
import { HttpActions } from './http.actions';

export function catchHttpError(err: HttpErrorResponse) {
  const { status, error } = err;
  const httpClientError: HttpClientError = { status, error };
  return of(HttpActions.clientError({ httpClientError }));
}
