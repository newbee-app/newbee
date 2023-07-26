import type {
  HttpClientError,
  HttpScreenError,
} from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to `HttpState`.
 */
export const HttpActions = createActionGroup({
  source: Keyword.Http,
  events: {
    /**
     * Set the HTTP state's error value to the fed-in value.
     */
    'Client Error': props<{ httpClientError: HttpClientError }>(),

    /**
     * Sets the HTTP state's screen error value to the fed-in value.
     */
    'Screen Error': props<{ httpScreenError: HttpScreenError }>(),

    /**
     * Set the HTTP state's error value to null.
     */
    'Reset Error': emptyProps(),
  },
});
