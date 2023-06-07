import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { testCreateOrgForm1 } from '@newbee/newbee/organization/util';
import {
  organizationVersion,
  testBaseCreateOrganizationDto1,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import { testOrganization1 } from '@newbee/shared/util';
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

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testOrganization1.slug).subscribe({
        next: (orgMember) => {
          try {
            expect(orgMember).toEqual(testOrganization1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/api/v${organizationVersion}/${UrlEndpoint.Organization}/${testOrganization1.slug}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testOrganization1);
    });
  });

  describe('create', () => {
    it('should send out a post request', (done) => {
      service.create(testCreateOrgForm1).subscribe({
        next: (organization) => {
          try {
            expect(organization).toEqual(testOrganization1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/api/v${organizationVersion}/${UrlEndpoint.Organization}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateOrganizationDto1);

      req.flush(testOrganization1);
    });
  });
});
