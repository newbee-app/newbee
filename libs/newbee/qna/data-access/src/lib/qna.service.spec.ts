import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testBaseCreateQnaDto1,
  testBaseQnaAndMemberDto1,
  testOrganization1,
  testQna1,
  testTeam1,
} from '@newbee/shared/util';
import { QnaService } from './qna.service';

describe('QnaService', () => {
  let service: QnaService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QnaService],
    });

    service = TestBed.inject(QnaService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(QnaService.baseApiUrl(testOrganization1.slug)).toEqual(
        `/${Keyword.Api}/v${apiVersion.qna}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Qna}`,
      );
    });
  });

  describe('create', () => {
    it('should send out a post request', (done) => {
      service
        .create(testBaseCreateQnaDto1, testOrganization1.slug, testTeam1.slug)
        .subscribe({
          next: (qna) => {
            try {
              expect(qna).toEqual(testQna1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const params = new HttpParams({
        fromObject: { [Keyword.Team]: testTeam1.slug },
      });
      const req = httpController.expectOne(
        `${QnaService.baseApiUrl(testOrganization1.slug)}?${params.toString()}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateQnaDto1);

      req.flush(testQna1);
    });
  });

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testQna1.slug, testOrganization1.slug).subscribe({
        next: (qnaAndMemberDto) => {
          try {
            expect(qnaAndMemberDto).toEqual(testBaseQnaAndMemberDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${QnaService.baseApiUrl(testOrganization1.slug)}/${testQna1.slug}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseQnaAndMemberDto1);
    });
  });

  describe('markUpToDate', () => {
    it('should send out a post request', (done) => {
      service.markUpToDate(testQna1.slug, testOrganization1.slug).subscribe({
        next: (qna) => {
          try {
            expect(qna).toEqual(testQna1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${QnaService.baseApiUrl(testOrganization1.slug)}/${testQna1.slug}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({});

      req.flush(testQna1);
    });
  });
});
