import { AuthState } from './auth';
import { CsrfState } from './csrf';
import { DarkState } from './dark';
import { HttpState } from './http';

/**
 * The global app state.
 * Able to be accessed from any portion of the frontend, right from first paint.
 */
export interface AppState {
  auth: AuthState;
  csrf: CsrfState;
  dark: DarkState;
  http: HttpState;
}
