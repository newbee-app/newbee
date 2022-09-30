import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { DarkActions } from './dark.actions';

export enum DarkMode {
  Active,
  Disabled,
  System,
}

export interface DarkState {
  mode: DarkMode;
}

export const initialDarkState: DarkState = {
  mode: DarkMode.System,
};

export const darkFeature = createFeature<AppState, 'dark'>({
  name: 'dark',
  reducer: createReducer(
    initialDarkState,
    on(
      DarkActions.activate,
      (state): DarkState => ({ ...state, mode: DarkMode.Active })
    ),
    on(
      DarkActions.disable,
      (state): DarkState => ({ ...state, mode: DarkMode.Disabled })
    ),
    on(
      DarkActions.system,
      (state): DarkState => ({ ...state, mode: DarkMode.System })
    )
  ),
});
