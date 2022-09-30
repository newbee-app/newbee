import { DarkActions } from './dark.actions';
import {
  darkFeature,
  DarkMode,
  DarkState,
  initialDarkState,
} from './dark.reducer';

describe('DarkReducer', () => {
  const stateAfterActivate: DarkState = {
    ...initialDarkState,
    mode: DarkMode.Active,
  };
  const stateAfterDisable: DarkState = {
    ...initialDarkState,
    mode: DarkMode.Disabled,
  };
  const stateAfterSystem: DarkState = {
    ...initialDarkState,
    mode: DarkMode.System,
  };

  it('unknown action should not affect state', () => {
    const action = { type: 'Unknown' };
    const updatedState = darkFeature.reducer(initialDarkState, action);
    expect(updatedState).toEqual(initialDarkState);
  });

  it('activate, disable, and system should update state', () => {
    let updatedState = darkFeature.reducer(
      initialDarkState,
      DarkActions.activate()
    );
    expect(updatedState).toEqual(stateAfterActivate);

    updatedState = darkFeature.reducer(initialDarkState, DarkActions.disable());
    expect(updatedState).toEqual(stateAfterDisable);

    updatedState = darkFeature.reducer(stateAfterDisable, DarkActions.system());
    expect(updatedState).toEqual(stateAfterSystem);
  });
});
