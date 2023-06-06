import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  cookieVersion,
  testBaseCsrfTokenAndDataDto1,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import { CookieService } from './cookie.service';

describe('CsrfService', () => {
  let service: CookieService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CookieService],
    });

    service = TestBed.inject(CookieService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('initCookies', () => {
    it('should send out a get request', (done) => {
      service.initCookies().subscribe({
        next: (csrfTokenDto) => {
          try {
            expect(csrfTokenDto).toEqual(testBaseCsrfTokenAndDataDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/api/v${cookieVersion}/${UrlEndpoint.Cookie}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseCsrfTokenAndDataDto1);
    });
  });
});
