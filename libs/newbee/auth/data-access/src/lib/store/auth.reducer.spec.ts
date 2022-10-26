import {
  testLoginDto1,
  testMagicLinkLoginDto1,
} from '@newbee/shared/data-access';
import { AuthActions } from './auth.actions';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterMagicLinkSuccess: AuthState = {
    ...initialAuthState,
    pendingMagicLink: true,
    jwtId: testMagicLinkLoginDto1.jwtId,
  };
  const stateAfterLoginSuccess: AuthState = {
    ...stateAfterMagicLinkSuccess,
    accessToken: testLoginDto1.access_token,
    user: testLoginDto1.user,
    pendingMagicLink: false,
    jwtId: null,
  };
  const stateAfterLoginError: AuthState = {
    ...stateAfterMagicLinkSuccess,
    pendingMagicLink: false,
    jwtId: null,
  };

  describe('start from initial state', () => {
    it('unknown action should not affect state', () => {
      const action = { type: 'Unknown' };
      const updatedState = authFeature.reducer(initialAuthState, action);
      expect(updatedState).toEqual(initialAuthState);
    });

    it('sendLoginMagicLinkSuccess and sendRegisterMagicLinkSuccess should update state', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.sendLoginMagicLinkSuccess(testMagicLinkLoginDto1)
      );
      expect(updatedState).toEqual(stateAfterMagicLinkSuccess);
    });
  });

  describe('start after sending magic link', () => {
    it('loginSuccess should update state', () => {
      const updatedState = authFeature.reducer(
        stateAfterMagicLinkSuccess,
        AuthActions.loginSuccess(testLoginDto1)
      );
      expect(updatedState).toEqual(stateAfterLoginSuccess);
    });

    it('loginError should update state', () => {
      const updatedState = authFeature.reducer(
        stateAfterMagicLinkSuccess,
        AuthActions.loginError()
      );
      expect(updatedState).toEqual(stateAfterLoginError);
    });
  });
});
