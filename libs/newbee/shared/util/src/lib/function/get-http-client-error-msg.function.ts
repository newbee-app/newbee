import { arrayToBullets } from '@newbee/shared/util';
import { HttpClientError } from '../interface';

/**
 * Takes in an `HttpClientError` and converts it into a single string.
 * If the error object is null, returns an empty string.
 * Takes in an optional key, which is only used if the error's messages property is an object.
 *
 * @param err The error object, which can be null.
 * @param key An optional key to retriee a specific message, if the error's messages property is an object.
 *
 * @returns A single string representing the error.
 */
export function getHttpClientErrorMsg(
  err: HttpClientError | null,
  key?: string
): string {
  if (!err) {
    return '';
  }

  const { messages } = err;
  if (typeof messages === 'string') {
    return messages;
  } else if (Array.isArray(messages)) {
    return arrayToBullets(messages);
  } else {
    // messages is object
    if (!key) {
      return arrayToBullets(Object.values(messages).flat());
    }

    const msg = messages[key];
    if (Array.isArray(msg)) {
      return arrayToBullets(msg);
    }

    return msg ?? '';
  }
}
