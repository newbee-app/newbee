import { HttpClientError } from '@newbee/newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const HttpActions = createActionGroup({
  source: 'Http',
  events: {
    'Client Error': props<{ httpClientError: HttpClientError }>(),
    'Reset Error': emptyProps(),
  },
});
