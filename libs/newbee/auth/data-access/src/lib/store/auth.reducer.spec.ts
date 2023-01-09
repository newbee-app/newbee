import { testLoginForm1, testRegisterForm1 } from '@newbee/newbee/auth/util';
import { AuthActions, HttpActions } from '@newbee/newbee/shared/data-access';
import { testHttpClientError1 } from '@newbee/newbee/shared/util';
import { testBaseMagicLinkLoginDto1 } from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterLoginMagicLink: AuthState = {
    ...initialAuthState,
    pendingMagicLink: true,
  };
  const stateAfterLoginMagicLinkSuccess: AuthState = {
    ...stateAfterLoginMagicLink,
    jwtId: testBaseMagicLinkLoginDto1.jwtId,
    email: testBaseMagicLinkLoginDto1.email,
    pendingMagicLink: false,
  };
  const stateAfterWebauthnRegisterChallenge: AuthState = {
    ...initialAuthState,
    pendingWebAuthn: true,
  };
  const stateAfterWebauthnLoginChallenge: AuthState = {
    ...initialAuthState,
    pendingWebAuthn: true,
  };

  describe('start from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const updatedState = authFeature.reducer(initialAuthState, action);
      expect(updatedState).toEqual(initialAuthState);
    });

    it('should update state for sendLoginMagicLink', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.sendLoginMagicLink({ loginForm: testLoginForm1 })
      );
      expect(updatedState).toEqual(stateAfterLoginMagicLink);
    });

    it('should update state for postWebauthnRegisterChallenge', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.postWebauthnRegisterChallenge({
          registerForm: testRegisterForm1,
        })
      );
      expect(updatedState).toEqual(stateAfterWebauthnRegisterChallenge);
    });

    it('should update state for getWebauthnLoginChallenge', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.getWebauthnLoginChallenge({ loginForm: testLoginForm1 })
      );
      expect(updatedState).toEqual(stateAfterWebauthnLoginChallenge);
    });
  });

  describe('start from altered state', () => {
    it('should update state for sendLoginMagicLinkSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginMagicLink,
        AuthActions.sendLoginMagicLinkSuccess({
          magicLinkLoginDto: testBaseMagicLinkLoginDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginMagicLinkSuccess);
    });

    it('should update state for loginSuccess', () => {
      let updatedState = authFeature.reducer(
        stateAfterLoginMagicLinkSuccess,
        AuthActions.loginSuccess({ user: testUser1 })
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebauthnLoginChallenge,
        AuthActions.loginSuccess({ user: testUser1 })
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebauthnRegisterChallenge,
        AuthActions.loginSuccess({ user: testUser1 })
      );
      expect(updatedState).toEqual(initialAuthState);
    });

    it('should update state for clientError', () => {
      let updatedState = authFeature.reducer(
        stateAfterLoginMagicLinkSuccess,
        HttpActions.clientError({ httpClientError: testHttpClientError1 })
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebauthnLoginChallenge,
        HttpActions.clientError({ httpClientError: testHttpClientError1 })
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebauthnRegisterChallenge,
        HttpActions.clientError({ httpClientError: testHttpClientError1 })
      );
      expect(updatedState).toEqual(initialAuthState);
    });
  });
});
