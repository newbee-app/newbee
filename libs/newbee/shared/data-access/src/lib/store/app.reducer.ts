import { AuthState } from './auth';
import { DarkState } from './dark';
import { HttpState } from './http';

/**
 * The global app state.
 * Able to be accessed from any portion of the frontend, right from first paint.
 */
export interface AppState {
  dark: DarkState;
  auth: AuthState;
  http: HttpState;
}
