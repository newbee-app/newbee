import { HttpErrorResponse } from '@angular/common/http';
import { Keyword, internalServerError } from '@newbee/shared/util';
import { errToHttpClientError } from './err-to-http-client-error.function';

describe('errToHttpClientError', () => {
  describe('err is not HttpErrorResponse', () => {
    it(`should try to get the error msg, but default to internalServerError if it can't be found`, () => {
      expect(errToHttpClientError(new Error('error'))).toEqual({
        status: 500,
        messages: 'error',
      });
      expect(errToHttpClientError('error')).toEqual({
        status: 500,
        messages: 'error',
      });
      expect(errToHttpClientError(['error', 'msg'])).toEqual({
        status: 500,
        messages: ['error', 'msg'],
      });
      expect(errToHttpClientError({})).toEqual({
        status: 500,
        messages: internalServerError,
      });

      expect(
        errToHttpClientError(new Error('error'), () => Keyword.Misc),
      ).toEqual({
        status: 500,
        messages: { [Keyword.Misc]: 'error' },
      });
      expect(errToHttpClientError('error', () => Keyword.Misc)).toEqual({
        status: 500,
        messages: { [Keyword.Misc]: 'error' },
      });
      expect(
        errToHttpClientError(['error', 'msg', 'a', 'b'], (msg) => {
          switch (msg) {
            case 'a':
              return 'a';
            case 'b':
              return 'b';
            default:
              return Keyword.Misc;
          }
        }),
      ).toEqual({
        status: 500,
        messages: { a: 'a', b: 'b', [Keyword.Misc]: ['error', 'msg'] },
      });
      expect(errToHttpClientError({}, () => Keyword.Misc)).toEqual({
        status: 500,
        messages: { [Keyword.Misc]: internalServerError },
      });
    });
  });

  describe('err is HttpErrorResponse', () => {
    it(`should try to get the error msg, but default to internalServerError if it can't be found`, () => {
      expect(
        errToHttpClientError(
          new HttpErrorResponse({ status: 400, error: { message: 'error' } }),
        ),
      ).toEqual({
        status: 400,
        messages: 'error',
      });
      expect(
        errToHttpClientError(
          new HttpErrorResponse({
            status: 400,
            error: { message: ['error', 'msg'] },
          }),
        ),
      ).toEqual({
        status: 400,
        messages: ['error', 'msg'],
      });
      expect(
        errToHttpClientError(new HttpErrorResponse({ status: 400, error: {} })),
      ).toEqual({ status: 400, messages: internalServerError });

      expect(
        errToHttpClientError(
          new HttpErrorResponse({ status: 400, error: 'error' }),
          () => Keyword.Misc,
        ),
      ).toEqual({
        status: 400,
        messages: { [Keyword.Misc]: 'error' },
      });
      expect(
        errToHttpClientError(
          new HttpErrorResponse({ status: 400, error: ['error', 'msg'] }),
          () => Keyword.Misc,
        ),
      ).toEqual({
        status: 400,
        messages: { [Keyword.Misc]: ['error', 'msg'] },
      });
      expect(
        errToHttpClientError(new HttpErrorResponse({ status: 400, error: {} })),
      ).toEqual({ status: 400, messages: internalServerError });
    });
  });
});
