import { HttpErrorResponse } from '@angular/common/http';
import {
  AlertType,
  ToastXPosition,
  ToastYPosition,
} from '@newbee/newbee/shared/util';
import { cold } from 'jest-marbles';
import { v4 } from 'uuid';
import { ToastActions } from '../store';
import { catchToastError } from './catch-toast-error.function';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('catchToastError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockV4.mockReturnValue('1');
  });

  it('should turn err into observable of addToast', () => {
    expect(
      catchToastError(
        new HttpErrorResponse({ status: 500, error: { message: 'error' } }),
      ),
    ).toBeObservable(
      cold('(a|)', {
        a: ToastActions.addToast({
          toast: {
            id: '1',
            header: '',
            text: 'error',
            type: AlertType.Error,
            position: [ToastXPosition.Center, ToastYPosition.Bottom],
            duration: 5000,
          },
        }),
      }),
    );
  });
});
