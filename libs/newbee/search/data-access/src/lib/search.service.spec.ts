import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testOrgSearchDto1,
  testOrgSearchResultsDto1,
  testOrgSuggestDto1,
  testOrganization1,
  testSuggestResultsDto1,
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
        `/${Keyword.Api}/v${apiVersion.org}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Search}`,
      );
    });
  });

  describe('search', () => {
    it('should send out a get request', (done) => {
      service.search(testOrgSearchDto1, testOrganization1.slug).subscribe({
        next: (result) => {
          try {
            expect(result).toEqual(testOrgSearchResultsDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { ...testOrgSearchDto1 } });
      const req = httpController.expectOne(
        `${SearchService.baseApiUrl(
          testOrganization1.slug,
        )}?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testOrgSearchResultsDto1);
    });
  });

  describe('suggest', () => {
    it('should send out a get request', (done) => {
      service.suggest(testOrgSuggestDto1, testOrganization1.slug).subscribe({
        next: (result) => {
          try {
            expect(result).toEqual(testSuggestResultsDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { ...testOrgSuggestDto1 } });
      const req = httpController.expectOne(
        `${SearchService.baseApiUrl(testOrganization1.slug)}/${
          Keyword.Suggest
        }?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testSuggestResultsDto1);
    });
  });
});
