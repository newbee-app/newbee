import { AuthState } from './auth';
import { DarkState } from './dark';
import { HttpState } from './http';

export interface AppState {
  dark: DarkState;
  auth: AuthState;
  http: HttpState;
}
