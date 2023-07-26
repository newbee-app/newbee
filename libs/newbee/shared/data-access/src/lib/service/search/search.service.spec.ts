import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  apiVersion,
  testBaseQueryDto1,
  testBaseQueryResultDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultDto1,
} from '@newbee/shared/data-access';
import { Keyword, testOrganization1 } from '@newbee/shared/util';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService],
    });

    service = TestBed.inject(SearchService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('search', () => {
    it('should send out a post request', (done) => {
      service.search(testBaseQueryDto1, testOrganization1.slug).subscribe({
        next: (result) => {
          try {
            expect(result).toEqual(testBaseQueryResultDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${Keyword.Api}/v${apiVersion.search}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Search}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseQueryDto1);

      req.flush(testBaseQueryResultDto1);
    });
  });

  describe('suggest', () => {
    it('should send out a post request', (done) => {
      service.suggest(testBaseSuggestDto1, testOrganization1.slug).subscribe({
        next: (result) => {
          try {
            expect(result).toEqual(testBaseSuggestResultDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${Keyword.Api}/v${apiVersion.search}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Search}/${Keyword.Suggest}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseSuggestDto1);

      req.flush(testBaseSuggestResultDto1);
    });
  });
});
