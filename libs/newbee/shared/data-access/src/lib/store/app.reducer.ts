import { AuthState } from './auth';
import { DarkState } from './dark';

export interface AppState {
  auth: AuthState;
  dark: DarkState;
}
