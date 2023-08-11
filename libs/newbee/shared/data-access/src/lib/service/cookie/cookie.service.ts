import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  apiVersion,
  BaseCsrfTokenAndDataDto,
} from '@newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Observable, retry } from 'rxjs';

/**
 * The service tied to the API's CSRF endpoints.
 * Specifically handles getting a CSRF token for CSRF prevention.
 */
@Injectable({ providedIn: 'root' })
export class CookieService {
  /**
   * The base API URL for dealing with cookies.
   */
  static baseApiUrl = `/${Keyword.Api}/v${apiVersion.cookie}/${Keyword.Cookie}`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a GET request to make the backend generate a CSRF token and load some initial data using existing cookies.
   *
   * @returns An observable of the CSRF token DTO.
   */
  initCookies(): Observable<BaseCsrfTokenAndDataDto> {
    return this.http
      .get<BaseCsrfTokenAndDataDto>(CookieService.baseApiUrl)
      .pipe(retry(3));
  }
}
