import { HttpErrorResponse } from '@angular/common/http';
import { cold } from 'jest-marbles';
import { HttpActions } from '../store';
import { catchHttpScreenError } from './catch-http-screen-error.function';

describe('catchHttpScreenError', () => {
  it('should turn err into observable of screenError', () => {
    expect(
      catchHttpScreenError(
        new HttpErrorResponse({ status: 500, error: { message: 'error' } })
      )
    ).toBeObservable(
      cold('(a|)', {
        a: HttpActions.screenError({
          httpScreenError: { status: 500, message: 'error' },
        }),
      })
    );
  });
});
