import {
  testLoginDto1,
  testMagicLinkLoginDto1,
} from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { AuthActions } from './auth.actions';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

const testAuthState1: AuthState = initialAuthState;

describe('AuthReducer', () => {
  describe('reducer', () => {
    it('unknown action should not affect state', () => {
      const action = { type: 'Unknown' };
      const updatedState = authFeature.reducer(testAuthState1, action);
      expect(updatedState).toEqual(testAuthState1);
    });

    it('sendMagicLinkSuccess should update state', () => {
      const updatedState = authFeature.reducer(
        testAuthState1,
        AuthActions.sendMagicLinkSuccess(testMagicLinkLoginDto1)
      );
      expect(updatedState).toEqual({
        ...testAuthState1,
        pendingMagicLink: true,
      });
    });

    it('loginSuccess should update state', () => {
      const updatedState = authFeature.reducer(
        testAuthState1,
        AuthActions.loginSuccess(testLoginDto1)
      );
      expect(updatedState).toEqual({
        ...testAuthState1,
        accessToken: testLoginDto1.access_token,
        user: testLoginDto1.user,
      });
    });

    it('unrelated action should not affect state', () => {
      let updatedState = authFeature.reducer(
        testAuthState1,
        AuthActions.sendMagicLink({ email: testUser1.email })
      );
      expect(updatedState).toEqual(testAuthState1);
      updatedState = authFeature.reducer(
        testAuthState1,
        AuthActions.sendMagicLinkError()
      );
      expect(updatedState).toEqual(testAuthState1);
      updatedState = authFeature.reducer(
        testAuthState1,
        AuthActions.loginError()
      );
      expect(updatedState).toEqual(testAuthState1);
    });
  });
});
