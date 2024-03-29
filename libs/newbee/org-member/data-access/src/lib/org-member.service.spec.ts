import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OrganizationService } from '@newbee/newbee/organization/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testBaseCreateOrgMemberInviteDto1,
  testBaseGetOrgMemberPostsDto1,
  testBaseUpdateOrgMemberDto1,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrganization1,
  testPaginatedResultsDocQueryResult1,
  testPaginatedResultsQnaQueryResult1,
} from '@newbee/shared/util';
import { OrgMemberService } from './org-member.service';

describe('OrgMemberService', () => {
  let service: OrgMemberService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrgMemberService],
    });

    service = TestBed.inject(OrgMemberService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(
        OrgMemberService.baseApiUrl(
          testOrganization1.slug,
          testOrgMember1.slug,
        ),
      ).toEqual(
        `/${Keyword.Api}/v${apiVersion['org-member']}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Member}/${testOrgMember1.slug}`,
      );
    });
  });

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testOrganization1.slug, testOrgMember1.slug).subscribe({
        next: (orgMember) => {
          try {
            expect(orgMember).toEqual(testOrgMemberRelation1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        OrgMemberService.baseApiUrl(
          testOrganization1.slug,
          testOrgMember1.slug,
        ),
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testOrgMemberRelation1);
    });
  });

  describe('edit', () => {
    it('should send out a patch request', (done) => {
      service
        .edit(
          testOrganization1.slug,
          testOrgMember1.slug,
          testBaseUpdateOrgMemberDto1,
        )
        .subscribe({
          next: (orgMember) => {
            try {
              expect(orgMember).toEqual(testOrgMember1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const req = httpController.expectOne(
        OrgMemberService.baseApiUrl(
          testOrganization1.slug,
          testOrgMember1.slug,
        ),
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testBaseUpdateOrgMemberDto1);

      req.flush(testOrgMember1);
    });
  });

  describe('delete', () => {
    it('should send out a delete request', (done) => {
      service.delete(testOrganization1.slug, testOrgMember1.slug).subscribe({
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
        OrgMemberService.baseApiUrl(
          testOrganization1.slug,
          testOrgMember1.slug,
        ),
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });

  describe('getAllDocs', () => {
    it('should send out a get request', (done) => {
      service
        .getAllDocs(
          testOrganization1.slug,
          testOrgMember1.slug,
          testBaseGetOrgMemberPostsDto1,
        )
        .subscribe({
          next: (results) => {
            try {
              expect(results).toEqual(testPaginatedResultsDocQueryResult1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const params = new HttpParams({
        fromObject: { ...testBaseGetOrgMemberPostsDto1 },
      });
      const req = httpController.expectOne(
        `${OrgMemberService.baseApiUrl(
          testOrganization1.slug,
          testOrgMember1.slug,
        )}/${Keyword.Doc}?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testPaginatedResultsDocQueryResult1);
    });
  });

  describe('getAllQnas', () => {
    it('should send out a get request', (done) => {
      service
        .getAllQnas(
          testOrganization1.slug,
          testOrgMember1.slug,
          testBaseGetOrgMemberPostsDto1,
        )
        .subscribe({
          next: (results) => {
            try {
              expect(results).toEqual(testPaginatedResultsQnaQueryResult1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const params = new HttpParams({
        fromObject: { ...testBaseGetOrgMemberPostsDto1 },
      });
      const req = httpController.expectOne(
        `${OrgMemberService.baseApiUrl(
          testOrganization1.slug,
          testOrgMember1.slug,
        )}/${Keyword.Qna}?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testPaginatedResultsQnaQueryResult1);
    });
  });

  describe('inviteUser', () => {
    it('should send out a post request', (done) => {
      service
        .inviteUser(testOrganization1.slug, testBaseCreateOrgMemberInviteDto1)
        .subscribe({
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
        `${OrganizationService.baseApiUrl}/${testOrganization1.slug}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateOrgMemberInviteDto1);

      req.flush(null);
    });
  });
});
