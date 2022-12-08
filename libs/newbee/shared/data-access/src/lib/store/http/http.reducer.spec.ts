import { testHttpClientError1 } from '@newbee/newbee/shared/util';
import { HttpActions } from './http.actions';
import { httpFeature, HttpState, initialHttpState } from './http.reducer';

describe('HttpReducer', () => {
  const stateAfterClientError: HttpState = {
    ...initialHttpState,
    error: testHttpClientError1,
  };

  it('unknown action should not affect state', () => {
    const action = { type: 'Unknown' };
    const updatedState = httpFeature.reducer(initialHttpState, action);
    expect(updatedState).toEqual(initialHttpState);
  });

  it('clientError should update state', () => {
    const updatedState = httpFeature.reducer(
      initialHttpState,
      HttpActions.clientError({ httpClientError: testHttpClientError1 })
    );
    expect(updatedState).toEqual(stateAfterClientError);
  });

  it('resetError should update state', () => {
    const updatedState = httpFeature.reducer(
      stateAfterClientError,
      HttpActions.resetError()
    );
    expect(updatedState).toEqual(initialHttpState);
  });
});
