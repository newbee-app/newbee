import { HttpErrorResponse } from '@angular/common/http';
import { internalServerError } from '@newbee/shared/util';
import { errToHttpClientError } from './err-to-http-client-error.function';

describe('errToHttpClientError', () => {
  describe('err is not HttpErrorResponse', () => {
    it('should return an internal server error', () => {
      expect(errToHttpClientError(new Error('error'))).toEqual({
        status: 500,
        messages: internalServerError,
      });
    });
  });

  describe('err is HttpErrorResponse', () => {
    it('should return the error if error response is just a string', () => {
      const err = new HttpErrorResponse({ status: 500, error: 'error' });
      expect(errToHttpClientError(err)).toEqual({
        status: 500,
        messages: 'error',
      });
      expect(errToHttpClientError(err, () => 'misc')).toEqual({
        status: 500,
        messages: { misc: 'error' },
      });
    });

    it('should return an internal server error if no message is in the error object', () => {
      expect(
        errToHttpClientError(new HttpErrorResponse({ status: 500, error: {} }))
      ).toEqual({ status: 500, messages: internalServerError });
    });

    it('should return the error if message is a string', () => {
      const err = new HttpErrorResponse({
        status: 500,
        error: { message: 'error' },
      });
      expect(errToHttpClientError(err)).toEqual({
        status: 500,
        messages: 'error',
      });
      expect(errToHttpClientError(err, () => 'misc')).toEqual({
        status: 500,
        messages: { misc: 'error' },
      });
    });

    it('should return the errors if message is an array', () => {
      const err = new HttpErrorResponse({
        status: 500,
        error: { message: ['some', 'error', 'here'] },
      });
      expect(errToHttpClientError(err)).toEqual({
        status: 500,
        messages: ['some', 'error', 'here'],
      });
      expect(
        errToHttpClientError(err, (msg) => {
          switch (msg) {
            case 'some':
              return 'a';
            default:
              return 'b';
          }
        })
      ).toEqual({ status: 500, messages: { a: 'some', b: ['error', 'here'] } });
    });
  });
});
