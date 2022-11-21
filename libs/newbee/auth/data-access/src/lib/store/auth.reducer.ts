import { User } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  jwtId: string | null;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
  jwtId: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.sendLoginMagicLinkSuccess,
      (state, { magicLinkLoginDto }): AuthState => ({
        ...state,
        jwtId: magicLinkLoginDto.jwtId,
      })
    ),
    on(
      AuthActions.getWebauthnRegisterChallengeSuccess,
      (state, { userCreatedDto }): AuthState => ({
        ...state,
        accessToken: userCreatedDto.access_token,
        user: userCreatedDto.user,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { loginDto }): AuthState => ({
        ...state,
        accessToken: loginDto.access_token,
        user: loginDto.user,
        jwtId: null,
      })
    )
  ),
});
