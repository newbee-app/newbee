import { UrlEndpoint } from '@newbee/shared/data-access';
import { createActionGroup, emptyProps } from '@ngrx/store';

/**
 * Actions for use with the router store.
 * Needed because the provided actions are plain strings and don't come with action creators.
 */
export const RouterActions = createActionGroup({
  source: UrlEndpoint.Router,
  events: {
    /**
     * Signifies that the ROUTER_REQUEST action was passed.
     */
    'Router Request': emptyProps(),
  },
});
