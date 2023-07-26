import type {
  HttpClientError,
  HttpScreenError,
} from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { RouterActions } from '../router';
import { HttpActions } from './http.actions';

/**
 * The piece of state holding any outstanding HTTP errors.
 */
export interface HttpState {
  /**
   * The error associated with the request, if it shouldn't take up the whole screen.
   */
  error: HttpClientError | null;

  /**
   * The error associated with the request, if it should take up the whole screen.
   */
  screenError: HttpScreenError | null;
}

/**
 * The initial value for `HttpState`.
 */
export const initialHttpState: HttpState = {
  error: null,
  screenError: null,
};

/**
 * The reducers and generated selectors for `HttpState`.
 */
export const httpFeature = createFeature({
  name: Keyword.Http,
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
      HttpActions.screenError,
      (state, { httpScreenError }): HttpState => ({
        ...state,
        screenError: httpScreenError,
      })
    ),
    on(
      HttpActions.resetError,
      RouterActions.routerRequest,
      (): HttpState => initialHttpState
    )
  ),
});
