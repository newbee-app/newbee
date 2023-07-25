import type { AuthState } from './auth';
import type { CookieState } from './cookie';
import type { HttpState } from './http';
import type { OrganizationState } from './organization';
import type { SearchState } from './search';
import { TeamState } from './team';

/**
 * The global app state.
 * Able to be accessed from any portion of the frontend, right from first paint.
 */
export interface AppState {
  auth: AuthState;
  cookie: CookieState;
  http: HttpState;
  org: OrganizationState;
  search: SearchState;
  team: TeamState;
}
