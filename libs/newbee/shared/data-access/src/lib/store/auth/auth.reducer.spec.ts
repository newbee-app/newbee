import {
  testBaseCsrfTokenAndDataDto1,
  testBaseUserRelationAndOptionsDto1,
} from '@newbee/shared/data-access';
import { testUser1, testUserRelation1 } from '@newbee/shared/util';
import { CookieActions } from '../cookie';
import { AuthActions } from './auth.actions';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterLoginSuccess: AuthState = {
    user: testUser1,
  };

  describe('from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const udpatedState = authFeature.reducer(initialAuthState, action);
      expect(udpatedState).toEqual(initialAuthState);
    });

    it('should update state for registerWithWebauthnSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.registerWithWebauthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for loginSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('should update state for initCookiesSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testBaseCsrfTokenAndDataDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });
  });

  describe('from login success', () => {
    it('should update state for logoutSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginSuccess,
        AuthActions.logoutSuccess()
      );
      expect(updatedState).toEqual(initialAuthState);
    });
  });
});
