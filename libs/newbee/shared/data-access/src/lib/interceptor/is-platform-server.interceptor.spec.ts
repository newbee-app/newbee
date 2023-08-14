import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BASE_API_URL } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { IsPlatformServerInterceptor } from './is-platform-server.interceptor';

describe('IsPlatformServerInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;
  const baseApiUrl = 'http://localhost:3333';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: IsPlatformServerInterceptor,
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
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('intercept', () => {
    it('should clone the request and prepend the base API URL to the URL', (done) => {
      const testVal = 'testVal';
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

      req.flush(testVal);
    });
  });
});
