import { HttpErrorResponse } from '@angular/common/http';
import { internalServerError } from '@newbee/shared/util';
import { cold } from 'jest-marbles';
import { HttpActions } from '../store';
import { catchHttpScreenError } from './catch-http-screen-error.function';

describe('catchHttpScreenError', () => {
  describe('error is not HttpErrorResponse', () => {
    it('should return internal server error', () => {
      expect(catchHttpScreenError(new Error('error'))).toBeObservable(
        cold('(a|)', {
          a: HttpActions.screenError({
            httpScreenError: { status: 500, message: internalServerError },
          }),
        })
      );
    });
  });

  describe('error is HttpErrorResponse', () => {
    it('should return a misc error if error is just a string', () => {
      expect(
        catchHttpScreenError(
          new HttpErrorResponse({ error: 'error', status: 500 })
        )
      ).toBeObservable(
        cold('(a|)', {
          a: HttpActions.screenError({
            httpScreenError: { status: 500, message: 'error' },
          }),
        })
      );
    });

    it('should return internal server error if no message is in the error object', () => {
      expect(
        catchHttpScreenError(new HttpErrorResponse({ error: {}, status: 500 }))
      ).toBeObservable(
        cold('(a|)', {
          a: HttpActions.screenError({
            httpScreenError: { status: 500, message: internalServerError },
          }),
        })
      );
    });

    it('should return message if message is a string', () => {
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

    it('should join messages if message is an array of strings', () => {
      expect(
        catchHttpScreenError(
          new HttpErrorResponse({
            status: 500,
            error: { message: ['some', 'error'] },
          })
        )
      ).toBeObservable(
        cold('(a|)', {
          a: HttpActions.screenError({
            httpScreenError: { status: 500, message: 'some, error' },
          }),
        })
      );
    });
  });
});
