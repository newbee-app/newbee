import { HttpErrorResponse } from '@angular/common/http';
import { internalServerError } from '@newbee/shared/util';
import { errToHttpScreenError } from './err-to-http-screen-error.function';

describe('errToHttpScreenError', () => {
  describe('err is not HttpErrorResponse', () => {
    it('should return internal server error', () => {
      expect(errToHttpScreenError(new Error('error'))).toEqual({
        status: 500,
        message: internalServerError,
      });
    });
  });

  describe('err is HttpErrorResponse', () => {
    it('should return the error if error is just a string', () => {
      expect(
        errToHttpScreenError(
          new HttpErrorResponse({ status: 500, error: 'error' })
        )
      );
    });

    it('should return internal server error if no message is in the error object', () => {
      expect(
        errToHttpScreenError(new HttpErrorResponse({ status: 500, error: {} }))
      ).toEqual({ status: 500, message: internalServerError });
    });

    it('should return message if message is a string', () => {
      expect(
        errToHttpScreenError(
          new HttpErrorResponse({ status: 500, error: { message: 'error' } })
        )
      ).toEqual({ status: 500, message: 'error' });
    });

    it('should return the messages as bullets if message is an array', () => {
      expect(
        errToHttpScreenError(
          new HttpErrorResponse({
            status: 500,
            error: { message: ['some', 'error'] },
          })
        )
      ).toEqual({ status: 500, message: '- some\n- error' });
    });
  });
});
