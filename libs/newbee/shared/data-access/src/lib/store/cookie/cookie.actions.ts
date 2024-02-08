import { CsrfTokenAndDataDto, Keyword } from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to `CookieState`.
 */
export const CookieActions = createActionGroup({
  source: Keyword.Cookie,
  events: {
    /**
     * Send a request to get a CSRF token and initial data from the API based on the user's cookies.
     * Should call `Init Cookies Success` with the result.
     */
    'Init Cookies': emptyProps(),

    /**
     * Saves the server-created CSRF token and initial data to the global store for use in future requests.
     */
    'Init Cookies Success': props<{
      csrfTokenAndDataDto: CsrfTokenAndDataDto;
    }>(),
  },
});
