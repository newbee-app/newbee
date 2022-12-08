import {
  AppState,
  authFeature,
  darkFeature,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { ActionReducerMap } from '@ngrx/store';

export const reducers: ActionReducerMap<AppState> = {
  dark: darkFeature.reducer,
  auth: authFeature.reducer,
  http: httpFeature.reducer,
};
