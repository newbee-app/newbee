import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testBaseCreateDocDto1,
  testBaseDocAndMemberDto1,
  testBaseUpdateDocDto1,
  testDoc1,
  testOrganization1,
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

  describe('create', () => {
    it('should send out a post request', (done) => {
      service.create(testOrganization1.slug, testBaseCreateDocDto1).subscribe({
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
      expect(req.request.body).toEqual(testBaseCreateDocDto1);

      req.flush(testDoc1);
    });
  });

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testDoc1.slug, testOrganization1.slug).subscribe({
        next: (docAndMemberDto) => {
          try {
            expect(docAndMemberDto).toEqual(testBaseDocAndMemberDto1);
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

      req.flush(testBaseDocAndMemberDto1);
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
        .edit(testDoc1.slug, testOrganization1.slug, testBaseUpdateDocDto1)
        .subscribe({
          next: (docAndMemberDto) => {
            try {
              expect(docAndMemberDto).toEqual(testBaseDocAndMemberDto1);
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
      expect(req.request.body).toEqual(testBaseUpdateDocDto1);

      req.flush(testBaseDocAndMemberDto1);
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
