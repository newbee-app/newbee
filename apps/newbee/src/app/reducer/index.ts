import {
  AppState,
  authFeature,
  cookieFeature,
  httpFeature,
  organizationFeature,
  searchFeature,
} from '@newbee/newbee/shared/data-access';
import { ActionReducerMap } from '@ngrx/store';

/**
 * The global map of features to reducers.
 * For use by the global `StoreModule`.
 */
export const reducers: ActionReducerMap<AppState> = {
  auth: authFeature.reducer,
  cookie: cookieFeature.reducer,
  http: httpFeature.reducer,
  org: organizationFeature.reducer,
  search: searchFeature.reducer,
};
