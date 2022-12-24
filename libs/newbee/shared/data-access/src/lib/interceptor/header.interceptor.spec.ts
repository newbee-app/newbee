import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { testBaseCsrfTokenDto1 } from '@newbee/shared/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { initialCsrfState } from '../store';
import { HeaderInterceptor } from './header.interceptor';

describe('HeaderInterceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            csrf: {
              ...initialCsrfState,
              csrfToken: testBaseCsrfTokenDto1.csrfToken,
            },
          },
        }),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HeaderInterceptor,
          multi: true,
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
    it('should clone the request and append headers', (done) => {
      const testVal = 'testVal';
      http.get<string>('/test').subscribe({
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

      const req = httpController.expectOne('/test');
      expect(req.request.method).toEqual('GET');

      const headers = req.request.headers;
      expect(headers.get('Content-Type')).toEqual('application/json');
      expect(headers.get('Session-Secret')).toEqual(
        initialCsrfState.sessionSecret
      );
      expect(headers.get('X-CSRF-TOKEN')).toEqual(
        testBaseCsrfTokenDto1.csrfToken
      );

      req.flush(testVal);
    });
  });
});
