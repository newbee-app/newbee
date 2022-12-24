import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  csrf,
  csrfVersion,
  testBaseCsrfTokenDto1,
} from '@newbee/shared/data-access';
import { CsrfService } from './csrf.service';

describe('CsrfService', () => {
  let service: CsrfService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CsrfService],
    });

    service = TestBed.inject(CsrfService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('createToken', () => {
    it('should send out a get request', (done) => {
      service.createToken().subscribe({
        next: (csrfTokenDto) => {
          try {
            expect(csrfTokenDto).toEqual(testBaseCsrfTokenDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(`/api/v${csrfVersion}/${csrf}`);
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseCsrfTokenDto1);
    });
  });
});
