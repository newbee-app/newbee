import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testBaseCreateOrganizationDto1,
  testBaseGenerateSlugDto1,
  testBaseGeneratedSlugDto1,
  testBaseOrgAndMemberDto1,
  testBaseSlugDto1,
  testBaseSlugTakenDto1,
  testBaseUpdateOrganizationDto1,
  testOrganization1,
  testOrganization2,
} from '@newbee/shared/util';
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

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(OrganizationService.baseApiUrl).toEqual(
        `/${Keyword.Api}/v${apiVersion.org}/${Keyword.Organization}`,
      );
    });
  });

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testOrganization1.slug).subscribe({
        next: (orgAndMemberDto) => {
          try {
            expect(orgAndMemberDto).toEqual(testBaseOrgAndMemberDto1);
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
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseOrgAndMemberDto1);
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

      const req = httpController.expectOne(OrganizationService.baseApiUrl);
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
        `${OrganizationService.baseApiUrl}/${testOrganization2.slug}`,
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
        `${OrganizationService.baseApiUrl}/${testOrganization1.slug}`,
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
        `${OrganizationService.baseApiUrl}/${
          Keyword.CheckSlug
        }?${params.toString()}`,
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
        `${OrganizationService.baseApiUrl}/${
          Keyword.GenerateSlug
        }?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseGeneratedSlugDto1);
    });
  });
});
