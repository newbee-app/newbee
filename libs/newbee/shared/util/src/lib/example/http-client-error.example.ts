import { HttpClientError } from '../interface';

/**
 * An example instance of `HttpClientError`.
 * Strictly for use in testing.
 */
export const testHttpClientError1: HttpClientError = {
  status: 400,
  messages: { misc: 'error' },
};
