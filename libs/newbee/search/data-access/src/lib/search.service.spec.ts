import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testBaseQueryDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultsDto1,
  testOrganization1,
  testQueryResults1,
} from '@newbee/shared/util';
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

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(SearchService.baseApiUrl(testOrganization1.slug)).toEqual(
        `/${Keyword.Api}/v${apiVersion.search}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Search}`,
      );
    });
  });

  describe('search', () => {
    it('should send out a get request', (done) => {
      service.search(testBaseQueryDto1, testOrganization1.slug).subscribe({
        next: (result) => {
          try {
            expect(result).toEqual(testQueryResults1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { ...testBaseQueryDto1 } });
      const req = httpController.expectOne(
        `${SearchService.baseApiUrl(
          testOrganization1.slug,
        )}?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testQueryResults1);
    });
  });

  describe('suggest', () => {
    it('should send out a get request', (done) => {
      service.suggest(testBaseSuggestDto1, testOrganization1.slug).subscribe({
        next: (result) => {
          try {
            expect(result).toEqual(testBaseSuggestResultsDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { ...testBaseSuggestDto1 } });
      const req = httpController.expectOne(
        `${SearchService.baseApiUrl(testOrganization1.slug)}/${
          Keyword.Suggest
        }?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseSuggestResultsDto1);
    });
  });
});
