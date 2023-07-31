import { HttpErrorResponse } from '@angular/common/http';
import { Keyword } from '@newbee/shared/util';
import { cold } from 'jest-marbles';
import { HttpActions } from '../store';
import { catchHttpClientError } from './catch-http-client-error.function';

describe('catchHttpClientError', () => {
  it('should turn err into observable of clientError', () => {
    expect(
      catchHttpClientError(
        new HttpErrorResponse({ status: 500, error: { message: 'error' } })
      )
    ).toBeObservable(
      cold('(a|)', {
        a: HttpActions.clientError({
          httpClientError: { status: 500, messages: 'error' },
        }),
      })
    );

    expect(
      catchHttpClientError(
        new HttpErrorResponse({ status: 500, error: { message: 'error' } }),
        () => Keyword.Misc
      )
    ).toBeObservable(
      cold('(a|)', {
        a: HttpActions.clientError({
          httpClientError: {
            status: 500,
            messages: { [Keyword.Misc]: 'error' },
          },
        }),
      })
    );
  });
});
