import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testCreateDocDto1,
  testDoc1,
  testDocAndMemberDto1,
  testOffsetAndLimit1,
  testOrganization1,
  testPaginatedResultsDocSearchResult1,
  testUpdateDocDto1,
} from '@newbee/shared/util';
import { DocService } from './doc.service';

describe('DocService', () => {
  let service: DocService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocService],
    });

    service = TestBed.inject(DocService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(DocService.baseApiUrl(testOrganization1.slug)).toEqual(
        `/${Keyword.Api}/v${apiVersion.doc}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Doc}`,
      );
    });
  });

  describe('getAll', () => {
    it('should send out a get request', (done) => {
      service.getAll(testOrganization1.slug, testOffsetAndLimit1).subscribe({
        next: (results) => {
          try {
            expect(results).toEqual(testPaginatedResultsDocSearchResult1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { ...testOffsetAndLimit1 } });
      const req = httpController.expectOne(
        `${DocService.baseApiUrl(testOrganization1.slug)}?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testPaginatedResultsDocSearchResult1);
    });
  });

  describe('create', () => {
    it('should send out a post request', (done) => {
      service.create(testOrganization1.slug, testCreateDocDto1).subscribe({
        next: (doc) => {
          try {
            expect(doc).toEqual(testDoc1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        DocService.baseApiUrl(testOrganization1.slug),
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testCreateDocDto1);

      req.flush(testDoc1);
    });
  });

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testDoc1.slug, testOrganization1.slug).subscribe({
        next: (docAndMemberDto) => {
          try {
            expect(docAndMemberDto).toEqual(testDocAndMemberDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${DocService.baseApiUrl(testOrganization1.slug)}/${testDoc1.slug}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testDocAndMemberDto1);
    });
  });

  describe('markUpToDate', () => {
    it('should send out a post request', (done) => {
      service.markUpToDate(testDoc1.slug, testOrganization1.slug).subscribe({
        next: (doc) => {
          try {
            expect(doc).toEqual(testDoc1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${DocService.baseApiUrl(testOrganization1.slug)}/${testDoc1.slug}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({});

      req.flush(testDoc1);
    });
  });

  describe('edit', () => {
    it('should send out a patch request', (done) => {
      service
        .edit(testDoc1.slug, testOrganization1.slug, testUpdateDocDto1)
        .subscribe({
          next: (docAndMemberDto) => {
            try {
              expect(docAndMemberDto).toEqual(testDocAndMemberDto1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const req = httpController.expectOne(
        `${DocService.baseApiUrl(testOrganization1.slug)}/${testDoc1.slug}`,
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testUpdateDocDto1);

      req.flush(testDocAndMemberDto1);
    });
  });

  describe('delete', () => {
    it('should send out a delete request', (done) => {
      service.delete(testDoc1.slug, testOrganization1.slug).subscribe({
        next: (signal) => {
          try {
            expect(signal).toBeNull();
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${DocService.baseApiUrl(testOrganization1.slug)}/${testDoc1.slug}`,
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });
});
