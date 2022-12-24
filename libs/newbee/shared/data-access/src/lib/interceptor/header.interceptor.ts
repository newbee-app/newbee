import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, take } from 'rxjs';
import { csrfFeature } from '../store';

/**
 * HTTP interceptor for setting all of the headers the backend expects, for every request.
 */
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  /**
   * The portion of the store needed for CSRF protection.
   */
  csrfState$ = this.store.select(csrfFeature.selectCsrfState);

  constructor(private readonly store: Store) {}

  /**
   * The method that intercepts the outgoing HTTP request to append headers.
   *
   * @param req The request in its unaltered form.
   * @param next The object containg the `handle()` method to call, once the headers have been appended.
   * @returns An observable representing the result of calling `next.handle()`.
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.csrfState$.pipe(
      take(1),
      switchMap((csrfState) => {
        const { csrfToken, sessionSecret } = csrfState;
        const reqWithHeaders = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',

            // CSRF stuff
            'Session-Secret': sessionSecret,
            'X-CSRF-TOKEN': csrfToken ?? '',
          },
        });
        return next.handle(reqWithHeaders);
      })
    );
  }
}
