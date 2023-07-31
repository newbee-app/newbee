import { v4 } from 'uuid';
import { AlertType, ToastXPosition, ToastYPosition } from '../enum';
import type { HttpClientError, Toast } from '../interface';

/**
 * Converts an `HttpClientError` to a toast object or an array of toasts, depending on the contents of the error.
 *
 * @param err The error to convert.
 *
 * @returns A toast object or an array of toasts.
 */
export function httpClientErrorToToast(err: HttpClientError): Toast | Toast[] {
  const { messages } = err;

  if (typeof messages === 'string') {
    return makeToast(messages);
  }

  if (Array.isArray(messages)) {
    return messages.map((msg) => makeToast(msg));
  }

  // messages is an object
  return Object.values(messages)
    .flat()
    .map((msg) => makeToast(msg));
}

/**
 * A small helper function that makes a toast for use in the `httpClientErrorToToast` function.
 *
 * @param text The text to use.
 *
 * @returns A `Toast` object.
 */
function makeToast(text: string): Toast {
  return {
    id: v4(),
    header: '',
    text,
    type: AlertType.Error,
    position: [ToastXPosition.Center, ToastYPosition.Bottom],
    duration: 5000,
  };
}
