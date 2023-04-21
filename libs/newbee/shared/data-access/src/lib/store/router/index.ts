import { getRouterSelectors } from '@ngrx/router-store';

/**
 * Selectors provided by `@ngrx/router-store` for accessing bits of Angular's router state.
 */
export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
  selectTitle,
} = getRouterSelectors();
