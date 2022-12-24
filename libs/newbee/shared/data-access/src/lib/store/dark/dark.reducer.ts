import { createFeature, createReducer, on } from '@ngrx/store';
import { DarkActions } from './dark.actions';

/**
 * All possible values for setting dark mode.
 */
export enum DarkMode {
  /**
   * Dark mode on.
   */
  Active,

  /**
   * Dark mode off.
   */
  Disabled,

  /**
   * Use system values for dark mode.
   */
  System,
}

/**
 * The piece of state that determines whether the browser is in dark mode.
 */
export interface DarkState {
  mode: DarkMode;
}

/**
 * The initial value for `DarkState`.
 */
export const initialDarkState: DarkState = {
  mode: DarkMode.System,
};

/**
 * The reducers and generated selectors for `DarkState`.
 */
export const darkFeature = createFeature({
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
