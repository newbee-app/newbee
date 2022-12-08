import { AuthActions } from '@newbee/newbee/shared/data-access';
import {
  testBaseLoginDto1,
  testBaseMagicLinkLoginDto1,
} from '@newbee/shared/data-access';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterLoginMagicLinkSuccess: AuthState = {
    ...initialAuthState,
    jwtId: testBaseMagicLinkLoginDto1.jwtId,
    email: testBaseMagicLinkLoginDto1.email,
  };

  describe('start from initial state', () => {
    it('should not affect state for unknown action', () => {
      const action = { type: 'Unknown' };
      const updatedState = authFeature.reducer(initialAuthState, action);
      expect(updatedState).toEqual(initialAuthState);
    });

    it('should update state for sendLoginMagicLinkSuccess', () => {
      const updatedState = authFeature.reducer(
        initialAuthState,
        AuthActions.sendLoginMagicLinkSuccess({
          magicLinkLoginDto: testBaseMagicLinkLoginDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginMagicLinkSuccess);
    });
  });

  describe('start after sending magic link', () => {
    it('should update state for loginSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginMagicLinkSuccess,
        AuthActions.loginSuccess({ loginDto: testBaseLoginDto1 })
      );
      expect(updatedState).toEqual(initialAuthState);
    });
  });
});
