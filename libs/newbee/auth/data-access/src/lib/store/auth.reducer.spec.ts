import { AuthActions } from '@newbee/newbee/shared/data-access';
import {
  testLoginDto1,
  testMagicLinkLoginDto1,
} from '@newbee/shared/data-access';
import { authFeature, AuthState, initialAuthState } from './auth.reducer';

describe('AuthReducer', () => {
  const stateAfterLoginMagicLinkSuccess: AuthState = {
    ...initialAuthState,
    jwtId: testMagicLinkLoginDto1.jwtId,
    email: testMagicLinkLoginDto1.email,
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
          magicLinkLoginDto: testMagicLinkLoginDto1,
        })
      );
      expect(updatedState).toEqual(stateAfterLoginMagicLinkSuccess);
    });
  });

  describe('start after sending magic link', () => {
    it('should update state for loginSuccess', () => {
      const updatedState = authFeature.reducer(
        stateAfterLoginMagicLinkSuccess,
        AuthActions.loginSuccess({ loginDto: testLoginDto1 })
      );
      expect(updatedState).toEqual(initialAuthState);
    });
  });
});
