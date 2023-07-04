import {
  testHttpClientError1,
  testHttpScreenError1,
} from '@newbee/newbee/shared/util';
import { RouterActions } from '../router';
import { HttpActions } from './http.actions';
import { httpFeature, HttpState, initialHttpState } from './http.reducer';

describe('HttpReducer', () => {
  const stateAfterClientError: HttpState = {
    ...initialHttpState,
    error: testHttpClientError1,
  };
  const stateAfterScreenError: HttpState = {
    ...initialHttpState,
    screenError: testHttpScreenError1,
  };

  describe('start from initial state', () => {
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

    it('screenError should update state', () => {
      const updatedState = httpFeature.reducer(
        initialHttpState,
        HttpActions.screenError({ httpScreenError: testHttpScreenError1 })
      );
      expect(updatedState).toEqual(stateAfterScreenError);
    });
  });

  describe('start from altered state', () => {
    it('resetError should update state', () => {
      let updatedState = httpFeature.reducer(
        stateAfterClientError,
        HttpActions.resetError()
      );
      expect(updatedState).toEqual(initialHttpState);

      updatedState = httpFeature.reducer(
        stateAfterScreenError,
        HttpActions.resetError()
      );
      expect(updatedState).toEqual(initialHttpState);
    });

    it('should update state for routerRequest', () => {
      let updatedState = httpFeature.reducer(
        stateAfterClientError,
        RouterActions.routerRequest()
      );
      expect(updatedState).toEqual(initialHttpState);

      updatedState = httpFeature.reducer(
        stateAfterScreenError,
        RouterActions.routerRequest()
      );
      expect(updatedState).toEqual(initialHttpState);
    });
  });
});
