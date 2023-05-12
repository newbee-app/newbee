import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  organizationUrl,
  orgMemberUrl,
  orgMemberVersion,
} from '@newbee/shared/data-access';
import { testOrganization1, testOrgMemberRelation1 } from '@newbee/shared/util';
import { OrganizationService } from './organization.service';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrganizationService],
    });

    service = TestBed.inject(OrganizationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('getAndSelectOrg', () => {
    it('should send out a post request', (done) => {
      service.getAndSelectOrg(testOrganization1.slug).subscribe({
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
        `/api/v${orgMemberVersion}/${organizationUrl}/${testOrganization1.slug}/${orgMemberUrl}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({});

      req.flush(testOrgMemberRelation1);
    });
  });
});
