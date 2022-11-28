import { HttpClientError } from '../interface';

export const testHttpClientError1: HttpClientError = {
  status: 400,
  error: new Error('error'),
};
