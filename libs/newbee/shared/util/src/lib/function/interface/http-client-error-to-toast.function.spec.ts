import { AlertType, ToastXPosition, ToastYPosition } from '../../enum';
import { httpClientErrorToToast } from './http-client-error-to-toast.function';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn().mockReturnValue('1'),
}));

describe('httpClientErrorToToast', () => {
  it('should return a single toast if messages is a string', () => {
    expect(httpClientErrorToToast({ status: 500, messages: 'error' })).toEqual({
      id: '1',
      header: '',
      text: 'error',
      type: AlertType.Error,
      position: [ToastXPosition.Center, ToastYPosition.Bottom],
      duration: 5000,
    });
  });

  it('should return an array of toasts if messages is an array', () => {
    expect(
      httpClientErrorToToast({ status: 500, messages: ['error'] }),
    ).toEqual([
      {
        id: '1',
        header: '',
        text: 'error',
        type: AlertType.Error,
        position: [ToastXPosition.Center, ToastYPosition.Bottom],
        duration: 5000,
      },
    ]);
  });

  it('should return an array of toasts if messages is an object', () => {
    expect(
      httpClientErrorToToast({ status: 500, messages: { a: 'error' } }),
    ).toEqual([
      {
        id: '1',
        header: '',
        text: 'error',
        type: AlertType.Error,
        position: [ToastXPosition.Center, ToastYPosition.Bottom],
        duration: 5000,
      },
    ]);
    expect(
      httpClientErrorToToast({ status: 500, messages: { a: ['error'] } }),
    ).toEqual([
      {
        id: '1',
        header: '',
        text: 'error',
        type: AlertType.Error,
        position: [ToastXPosition.Center, ToastYPosition.Bottom],
        duration: 5000,
      },
    ]);
  });
});
