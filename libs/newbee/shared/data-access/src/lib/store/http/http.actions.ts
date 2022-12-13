import { HttpClientError } from '@newbee/newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to `HttpState`.
 */
export const HttpActions = createActionGroup({
  source: 'Http',
  events: {
    /**
     * Set the HTTP state's error value to the fed-in value.
     */
    'Client Error': props<{ httpClientError: HttpClientError }>(),

    /**
     * Set the HTTP state's error value to null.
     */
    'Reset Error': emptyProps(),
  },
});
