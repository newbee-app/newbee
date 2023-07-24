import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  teamVersion,
  testBaseCreateTeamDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import {
  testOrganization1,
  testTeam1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamService],
    });

    service = TestBed.inject(TeamService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testTeam1.slug, testOrganization1.slug).subscribe({
        next: (team) => {
          try {
            expect(team).toEqual(testTeamRelation1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${UrlEndpoint.Api}/v${teamVersion}/${UrlEndpoint.Organization}/${testOrganization1.slug}/${UrlEndpoint.Team}/${testTeam1.slug}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testTeamRelation1);
    });
  });

  describe('create', () => {
    it('should send out a post request', (done) => {
      service.create(testBaseCreateTeamDto1, testOrganization1.slug).subscribe({
        next: (team) => {
          try {
            expect(team).toEqual(testTeamRelation1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${UrlEndpoint.Api}/v${teamVersion}/${UrlEndpoint.Organization}/${testOrganization1.slug}/${UrlEndpoint.Team}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateTeamDto1);

      req.flush(testTeamRelation1);
    });
  });

  describe('checkSlug', () => {
    it('should send out a get request', (done) => {
      service.checkSlug(testTeam1.slug, testOrganization1.slug).subscribe({
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

      const params = new HttpParams({ fromObject: { slug: testTeam1.slug } });
      const req = httpController.expectOne(
        `/${UrlEndpoint.Api}/v${teamVersion}/${UrlEndpoint.Organization}/${
          testOrganization1.slug
        }/${UrlEndpoint.Team}/${UrlEndpoint.CheckSlug}?${params.toString()}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseSlugTakenDto1);
    });
  });

  describe('generateSlug', () => {
    it('should send out a get request', (done) => {
      service.generateSlug(testTeam1.name, testOrganization1.slug).subscribe({
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

      const params = new HttpParams({ fromObject: { base: testTeam1.name } });
      const req = httpController.expectOne(
        `/${UrlEndpoint.Api}/v${teamVersion}/${UrlEndpoint.Organization}/${
          testOrganization1.slug
        }/${UrlEndpoint.Team}/${UrlEndpoint.GenerateSlug}?${params.toString()}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseGeneratedSlugDto1);
    });
  });
});
