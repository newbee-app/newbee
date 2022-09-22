import { User } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AuthActions } from './auth.actions';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  pendingMagicLink: boolean;
  jwtId: string | null;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
  pendingMagicLink: false,
  jwtId: null,
};

export const authFeature = createFeature<AppState>({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.sendLoginMagicLinkSuccess,
      AuthActions.sendRegisterMagicLinkSuccess,
      (state, { jwtId }): AuthState => ({
        ...state,
        pendingMagicLink: true,
        jwtId,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { access_token, user }): AuthState => ({
        ...state,
        accessToken: access_token,
        user,
        pendingMagicLink: false,
        jwtId: null,
      })
    ),
    on(
      AuthActions.loginError,
      (state): AuthState => ({
        ...state,
        pendingMagicLink: false,
        jwtId: null,
      })
    )
  ),
});
