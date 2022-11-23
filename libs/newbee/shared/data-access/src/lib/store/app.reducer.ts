import { AuthState } from './auth/auth.reducer';
import { DarkState } from './dark';

export interface AppState {
  dark: DarkState;
  auth: AuthState;
}
