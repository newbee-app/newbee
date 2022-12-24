import { BaseCsrfTokenDto } from '@newbee/shared/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to `CsrfState`.
 */
export const CsrfActions = createActionGroup({
  source: 'CSRF',
  events: {
    /**
     * Send a request to get a CSRF token from the API.
     * Should call `Get CSRF Token Success` with the result.
     */
    'Get CSRF Token': emptyProps(),

    /**
     * Saves the server-created CSRF token to the global store for use in future requests.
     */
    'Get CSRF Token Success': props<{ csrfTokenDto: BaseCsrfTokenDto }>(),
  },
});
