import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BASE_API_URL } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { NgUniversalInterceptor } from './ng-universal.interceptor';

describe('NgUniversalInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  const baseApiUrl = 'http://localhost:3333';
  const testCookie = 'cookie';
  const testVal = 'testVal';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NgUniversalInterceptor,
          multi: true,
        },
        {
          provide: BASE_API_URL,
          useValue: baseApiUrl,
        },
        {
          provide: PLATFORM_ID,
          useValue: 'server',
        },
        {
          provide: REQUEST,
          useValue: { headers: { cookie: testCookie } },
        },
      ],
    });
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('intercept', () => {
    it('should clone the request, prepend the base API URL to the URL, and add the request cookie', (done) => {
      httpController = TestBed.inject(HttpTestingController);
      http = TestBed.inject(HttpClient);

      http.get<string>(`/${Keyword.Api}/test`).subscribe({
        next: (val) => {
          try {
            expect(val).toEqual(testVal);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(`${baseApiUrl}/${Keyword.Api}/test`);
      expect(req.request.method).toEqual('GET');

      const headers = req.request.headers;
      expect(headers.get('cookie')).toEqual(testCookie);

      req.flush(testVal);
    });

    it('should do nothing if on browser-side', (done) => {
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' });
      httpController = TestBed.inject(HttpTestingController);
      http = TestBed.inject(HttpClient);

      http.get<string>(`/${Keyword.Api}/test`).subscribe({
        next: (val) => {
          try {
            expect(val).toEqual(testVal);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(`/${Keyword.Api}/test`);
      expect(req.request.method).toEqual('GET');

      const headers = req.request.headers;
      expect(headers.get('cookie')).toBeNull();

      req.flush(testVal);
    });
  });
});
