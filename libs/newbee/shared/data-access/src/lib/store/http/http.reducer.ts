import { HttpClientError } from '@newbee/newbee/shared/util';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { RouterActions } from '../router';
import { HttpActions } from './http.actions';

/**
 * The piece of state holding any outstanding HTTP errors.
 */
export interface HttpState {
  error: HttpClientError | null;
}

/**
 * The initial value for `HttpState`.
 */
export const initialHttpState: HttpState = {
  error: null,
};

/**
 * The reducers and generated selectors for `HttpState`.
 */
export const httpFeature = createFeature({
  name: UrlEndpoint.Http,
  reducer: createReducer(
    initialHttpState,
    on(
      HttpActions.clientError,
      (state, { httpClientError }): HttpState => ({
        ...state,
        error: httpClientError,
      })
    ),
    on(
      HttpActions.resetError,
      RouterActions.routerRequest,
      (state): HttpState => ({ ...state, error: null })
    )
  ),
});
