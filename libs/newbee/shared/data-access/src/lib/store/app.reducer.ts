import { Keyword } from '@newbee/shared/util';
import type { AuthState } from './auth';
import type { CookieState } from './cookie';
import { DocState } from './doc';
import type { HttpState } from './http';
import type { OrgMemberState } from './org-member';
import type { OrganizationState } from './organization';
import { QnaState } from './qna';
import type { SearchState } from './search';
import type { TeamState } from './team';
import type { ToastState } from './toast';

/**
 * The global app state.
 * Able to be accessed from any portion of the frontend, right from first paint.
 */
export interface AppState {
  [Keyword.Auth]: AuthState;
  [Keyword.Cookie]: CookieState;
  [Keyword.Doc]: DocState;
  [Keyword.Http]: HttpState;
  [Keyword.Member]: OrgMemberState;
  [Keyword.Organization]: OrganizationState;
  [Keyword.Qna]: QnaState;
  [Keyword.Search]: SearchState;
  [Keyword.Team]: TeamState;
  [Keyword.Toast]: ToastState;
}
