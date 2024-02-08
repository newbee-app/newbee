import { testCsrfTokenAndDataDto1 } from '@newbee/shared/util';
import { CookieActions } from './cookie.actions';
import {
  cookieFeature,
  CookieState,
  initialCookieState,
} from './cookie.reducer';

describe('CookieReducer', () => {
  const stateAfterInitCookiesSuccess: CookieState = {
    ...initialCookieState,
    csrfToken: testCsrfTokenAndDataDto1.csrfToken,
  };

  describe('from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const updatedState = cookieFeature.reducer(initialCookieState, action);
      expect(updatedState).toEqual(initialCookieState);
    });

    it('should update state for initCookiesSuccess', () => {
      const updatedState = cookieFeature.reducer(
        initialCookieState,
        CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testCsrfTokenAndDataDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterInitCookiesSuccess);
    });
  });
});
