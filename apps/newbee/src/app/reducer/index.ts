import {
  AppState,
  authFeature,
  cookieFeature,
  httpFeature,
  organizationFeature,
  orgMemberFeature,
  qnaFeature,
  searchFeature,
  teamFeature,
  toastFeature,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { ActionReducerMap } from '@ngrx/store';

/**
 * The global map of features to reducers.
 * For use by the global `StoreModule`.
 */
export const reducers: ActionReducerMap<AppState> = {
  [Keyword.Auth]: authFeature.reducer,
  [Keyword.Cookie]: cookieFeature.reducer,
  [Keyword.Http]: httpFeature.reducer,
  [Keyword.Member]: orgMemberFeature.reducer,
  [Keyword.Organization]: organizationFeature.reducer,
  [Keyword.Qna]: qnaFeature.reducer,
  [Keyword.Search]: searchFeature.reducer,
  [Keyword.Team]: teamFeature.reducer,
  [Keyword.Toast]: toastFeature.reducer,
};
