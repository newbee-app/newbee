import { HttpClientError } from '@newbee/newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
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
  name: 'http',
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
      (state): HttpState => ({ ...state, error: null })
    )
  ),
});
