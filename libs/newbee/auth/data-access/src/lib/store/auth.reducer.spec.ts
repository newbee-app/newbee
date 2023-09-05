import {
  AuthActions,
  HttpActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { testHttpClientError1 } from '@newbee/newbee/shared/util';
import { testBaseMagicLinkLoginDto1 } from '@newbee/shared/data-access';
import { testUserRelation1 } from '@newbee/shared/util';
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
  const stateAfterWebAuthnRegisterChallenge: AuthState = {
    ...initialAuthState,
    pendingWebAuthn: true,
  };
  const stateAfterWebAuthnLoginChallenge: AuthState = {
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
        AuthActions.sendLoginMagicLink,
      );
      expect(updatedState).toEqual(stateAfterLoginMagicLink);
    });

    it('should update state for registerWithWebAuthn', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.registerWithWebAuthn,
      );
      expect(updatedState).toEqual(stateAfterWebAuthnRegisterChallenge);
    });

    it('should update state for createWebAuthnLoginOptions', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.createWebAuthnLoginOptions,
      );
      expect(updatedState).toEqual(stateAfterWebAuthnLoginChallenge);
    });
  });

  describe('start from altered state', () => {
    it('should update state for sendLoginMagicLinkSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginMagicLink,
        AuthActions.sendLoginMagicLinkSuccess({
          magicLinkLoginDto: testBaseMagicLinkLoginDto1,
        }),
      );
      expect(updatedState).toEqual(stateAfterLoginMagicLinkSuccess);
    });

    it('should update state for loginSuccess', () => {
      let updatedState = authFeature.reducer(
        stateAfterLoginMagicLinkSuccess,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebAuthnLoginChallenge,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebAuthnRegisterChallenge,
        AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      );
      expect(updatedState).toEqual(initialAuthState);
    });

    it('should update state for clientError', () => {
      let updatedState = authFeature.reducer(
        stateAfterLoginMagicLinkSuccess,
        HttpActions.clientError({ httpClientError: testHttpClientError1 }),
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebAuthnLoginChallenge,
        HttpActions.clientError({ httpClientError: testHttpClientError1 }),
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebAuthnRegisterChallenge,
        HttpActions.clientError({ httpClientError: testHttpClientError1 }),
      );
      expect(updatedState).toEqual(initialAuthState);
    });

    it('should update state for routerRequest', () => {
      let updatedState = authFeature.reducer(
        stateAfterLoginMagicLinkSuccess,
        RouterActions.routerRequest(),
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebAuthnLoginChallenge,
        RouterActions.routerRequest(),
      );
      expect(updatedState).toEqual(initialAuthState);

      updatedState = authFeature.reducer(
        stateAfterWebAuthnRegisterChallenge,
        RouterActions.routerRequest(),
      );
      expect(updatedState).toEqual(initialAuthState);
    });
  });
});
