import { User } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AuthActions } from './auth.actions';

export interface AuthState {
  accessToken: string;
  user: User | null;
  pendingMagicLink: boolean;
}

export const initialAuthState: AuthState = {
  accessToken: '',
  user: null,
  pendingMagicLink: false,
};

export const authFeature = createFeature<AppState>({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.sendMagicLinkSuccess,
      (state): AuthState => ({
        ...state,
        pendingMagicLink: true,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { access_token, user }): AuthState => ({
        ...state,
        accessToken: access_token,
        user,
        pendingMagicLink: false,
      })
    )
  ),
});
