import {
  AppState,
  authFeature,
  darkFeature,
} from '@newbee/newbee/shared/data-access';
import { ActionReducerMap } from '@ngrx/store';

export const reducers: ActionReducerMap<AppState> = {
  auth: authFeature.reducer,
  dark: darkFeature.reducer,
};
