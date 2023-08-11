import { isPlatformServer } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BASE_API_URL } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { Observable } from 'rxjs';

/**
 * HTTP interceptor for adding the base API URL to any `/api` requests made on the server, for use in Angular Universal.
 * The value for the base API URL is expected to be provided in the app module, along with this interceptor.
 * If running on the client side, the interceptor does nothing.
 */
@Injectable()
export class IsPlatformServerInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Inject(BASE_API_URL) private readonly baseApiUrl: string
  ) {}

  /**
   * The method that intercepts the outgoing HTTP request to prepend the base API URL to the request's URL.
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
    const isServer = isPlatformServer(this.platformId);
    if (!isServer || !req.url.startsWith(`/${Keyword.Api}`)) {
      return next.handle(req);
    }

    const fullUrlReq = req.clone({ url: `${this.baseApiUrl}${req.url}` });
    return next.handle(fullUrlReq);
  }
}
