import { User } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AuthActions } from './auth.actions';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
};

export const authFeature = createFeature<AppState, 'auth'>({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.getWebauthnRegisterChallengeSuccess,
      (state, { userCreatedDto: { access_token, user } }): AuthState => ({
        ...state,
        accessToken: access_token,
        user,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { loginDto: { access_token, user } }): AuthState => ({
        ...state,
        accessToken: access_token,
        user,
      })
    )
  ),
});
