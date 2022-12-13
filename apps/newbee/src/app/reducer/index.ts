import {
  AppState,
  authFeature,
  darkFeature,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { ActionReducerMap } from '@ngrx/store';

/**
 * The global map of features to reducers.
 * For use by the global `StoreModule`.
 */
export const reducers: ActionReducerMap<AppState> = {
  dark: darkFeature.reducer,
  auth: authFeature.reducer,
  http: httpFeature.reducer,
};
