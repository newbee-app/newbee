import { HttpErrorResponse } from '@angular/common/http';
import type { HttpClientError } from '@newbee/newbee/shared/util';
import { internalServerError } from '@newbee/shared/util';
import { cold } from 'jest-marbles';
import { HttpActions } from '../store';
import { catchHttpError } from './catch-http-error.function';

describe('CatchHttpError', () => {
  const internalServerHttpClientError: HttpClientError = {
    status: 500,
    messages: { misc: internalServerError },
  };

  describe('error is not HttpErrorResponse', () => {
    it('should return a misc internal server error if error is not an HttpErrorResponse', () => {
      expect(catchHttpError(new Error('error'), () => 'misc')).toBeObservable(
        cold('(a|)', {
          a: HttpActions.clientError({
            httpClientError: internalServerHttpClientError,
          }),
        })
      );
    });
  });

  describe('error is HttpErrorResponse', () => {
    it('should return a misc error if error response is just a string', () => {
      expect(
        catchHttpError(
          new HttpErrorResponse({ error: 'error', status: 500 }),
          () => 'misc'
        )
      ).toBeObservable(
        cold('(a|)', {
          a: HttpActions.clientError({
            httpClientError: { status: 500, messages: { misc: 'error' } },
          }),
        })
      );
    });

    it('should return a misc internal server error if no message is in the error object', () => {
      expect(
        catchHttpError(
          new HttpErrorResponse({ error: {}, status: 500 }),
          () => 'misc'
        )
      ).toBeObservable(
        cold('(a|)', {
          a: HttpActions.clientError({
            httpClientError: internalServerHttpClientError,
          }),
        })
      );
    });

    it('should sort message if message is a string', () => {
      expect(
        catchHttpError(
          new HttpErrorResponse({ error: { message: 'error' }, status: 500 }),
          (message) => {
            if (message === 'error') {
              return 'auth';
            }

            return 'misc';
          }
        )
      ).toBeObservable(
        cold('(a|)', {
          a: HttpActions.clientError({
            httpClientError: { status: 500, messages: { auth: 'error' } },
          }),
        })
      );
    });

    it('should sort message if message is an array of strings', () => {
      expect(
        catchHttpError(
          new HttpErrorResponse({
            error: { message: ['some', 'error', 'here', 'there'] },
            status: 400,
          }),
          (message) => {
            switch (message) {
              case 'some':
                return 'auth';
              case 'error':
                return 'org';
              default:
                return 'misc';
            }
          }
        )
      ).toBeObservable(
        cold('(a|)', {
          a: HttpActions.clientError({
            httpClientError: {
              status: 400,
              messages: {
                auth: 'some',
                org: 'error',
                misc: 'there',
              },
            },
          }),
        })
      );
    });
  });
});
