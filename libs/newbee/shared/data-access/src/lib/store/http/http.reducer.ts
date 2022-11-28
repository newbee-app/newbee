import { HttpClientError } from '@newbee/newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { HttpActions } from './http.actions';

export interface HttpState {
  error: HttpClientError | null;
}

export const initialHttpState: HttpState = {
  error: null,
};

export const httpFeature = createFeature<AppState, 'http'>({
  name: 'http',
  reducer: createReducer(
    initialHttpState,
    on(
      HttpActions.clientError,
      (state, { httpClientError }): HttpState => ({
        ...state,
        error: httpClientError,
      })
    )
  ),
});
