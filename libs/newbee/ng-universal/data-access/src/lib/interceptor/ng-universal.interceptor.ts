import { isPlatformServer } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { BASE_API_URL } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { Observable } from 'rxjs';

/**
 * HTTP interceptor for Angular Universal.
 * Adds the base API URL to any `/api` requests made on the server and adds the browser's cookie to the request (needed to authenticate the user for the universal request).
 * The value for the base API URL is expected to be provided in the app module, along with this interceptor.
 * If running on the client side, the interceptor does nothing.
 */
@Injectable()
export class NgUniversalInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Inject(BASE_API_URL) private readonly baseApiUrl: string,
    @Optional() @Inject(REQUEST) private readonly request: Request | null
  ) {}

  /**
   * The method that intercepts the outgoing SSR HTTP request to properly format it for SSR.
   *
   * @param req The request in its unaltered form.
   * @param next The object containing the `handle()` method to call once the base API URL has been prepended.
   *
   * @returns An observable representing the result of calling `next.handle()`.
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // If not SSR and the request doesn't start with `/api`, skip
    const isServer = isPlatformServer(this.platformId);
    if (!isServer || !req.url.startsWith(`/${Keyword.Api}`)) {
      return next.handle(req);
    }

    // Get the request's cookies but exclude the CSRF token, which will be inaccurate and irrelevant
    const requestCookies = this.request?.headers.cookie
      ?.split('; ')
      .filter((cookieStr) => !cookieStr.startsWith('CSRF-TOKEN='))
      .join('; ');

    // Create a new request with the full API URL and browser's cookies
    // Mainly needed to carry over the newbee_bearer token, so the user doesn't see a flicker for an unauthenticated screen
    const newReq = req.clone({
      url: `${this.baseApiUrl}${req.url}`,
      ...(requestCookies && {
        setHeaders: { cookie: requestCookies },
      }),
    });
    return next.handle(newReq);
  }
}
