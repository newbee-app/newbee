import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  organizationVersion,
  orgMemberInviteVersion,
  testBaseCreateOrganizationDto1,
  testBaseCreateOrgMemberInviteDto1,
  testBaseGeneratedSlugDto1,
  testBaseGenerateSlugDto1,
  testBaseSlugDto1,
  testBaseSlugTakenDto1,
  testBaseUpdateOrganizationDto1,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import { testOrganization1, testOrganization2 } from '@newbee/shared/util';
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
        `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}/${testOrganization1.slug}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testOrganization1);
    });
  });

  describe('create', () => {
    it('should send out a post request', (done) => {
      service.create(testBaseCreateOrganizationDto1).subscribe({
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
        `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateOrganizationDto1);

      req.flush(testOrganization1);
    });
  });

  describe('edit', () => {
    it('should send out a patch request', (done) => {
      service
        .edit(testOrganization2.slug, testBaseUpdateOrganizationDto1)
        .subscribe({
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
        `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}/${testOrganization2.slug}`
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testBaseUpdateOrganizationDto1);

      req.flush(testOrganization1);
    });
  });

  describe('delete', () => {
    it('should send out a delete request', (done) => {
      service.delete(testOrganization1.slug).subscribe({
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
        `/${UrlEndpoint.Api}/v${organizationVersion}/${UrlEndpoint.Organization}/${testOrganization1.slug}`
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });

  describe('checkSlug', () => {
    it('should send out a get request', (done) => {
      service.checkSlug(testOrganization1.slug).subscribe({
        next: (slugTakenDto) => {
          try {
            expect(slugTakenDto).toEqual(testBaseSlugTakenDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({
        fromObject: { ...testBaseSlugDto1 },
      });
      const req = httpController.expectOne(
        `/${UrlEndpoint.Api}/v${organizationVersion}/${
          UrlEndpoint.Organization
        }/${UrlEndpoint.CheckSlug}?${params.toString()}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseSlugTakenDto1);
    });
  });

  describe('generateSlug', () => {
    it('should send out a get request', (done) => {
      service.generateSlug(testOrganization1.name).subscribe({
        next: (generatedSlugDto) => {
          try {
            expect(generatedSlugDto).toEqual(testBaseGeneratedSlugDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({
        fromObject: { ...testBaseGenerateSlugDto1 },
      });
      const req = httpController.expectOne(
        `/${UrlEndpoint.Api}/v${organizationVersion}/${
          UrlEndpoint.Organization
        }/${UrlEndpoint.GenerateSlug}?${params.toString()}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseGeneratedSlugDto1);
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
        `/${UrlEndpoint.Api}/v${orgMemberInviteVersion}/${UrlEndpoint.Invite}/${UrlEndpoint.Organization}/${testOrganization1.slug}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateOrgMemberInviteDto1);

      req.flush(null);
    });
  });
});
