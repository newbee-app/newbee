import { AuthActions } from '@newbee/newbee/shared/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';

export interface AuthState {
  jwtId: string | null;
  email: string | null;
}

export const initialAuthState: AuthState = {
  jwtId: null,
  email: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.sendLoginMagicLinkSuccess,
      (state, { magicLinkLoginDto: { jwtId, email } }): AuthState => ({
        ...state,
        jwtId,
        email,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state): AuthState => ({
        ...state,
        jwtId: null,
        email: null,
      })
    )
  ),
});
