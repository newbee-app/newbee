import { Params } from '@angular/router';

/**
 * A simple interface for forwarding a route and query params.
 */
export interface RouteAndQueryParams {
  route: string;
  queryParams?: Params;
}
