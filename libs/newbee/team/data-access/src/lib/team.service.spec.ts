import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testBaseCreateTeamDto1,
  testBaseCreateTeamMemberDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugTakenDto1,
  testBaseTeamAndMemberDto1,
  testBaseUpdateTeamDto1,
  testBaseUpdateTeamMemberDto1,
  testOrgMember1,
  testOrganization1,
  testTeam1,
  testTeamMember1,
  testTeamMemberRelation1,
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

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(TeamService.baseApiUrl(testOrganization1.slug)).toEqual(
        `/${Keyword.Api}/v${apiVersion.team}/${Keyword.Organization}/${testOrganization1.slug}/${Keyword.Team}`,
      );
    });
  });

  describe('get', () => {
    it('should send out a get request', (done) => {
      service.get(testTeam1.slug, testOrganization1.slug).subscribe({
        next: (team) => {
          try {
            expect(team).toEqual(testBaseTeamAndMemberDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${TeamService.baseApiUrl(testOrganization1.slug)}/${testTeam1.slug}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseTeamAndMemberDto1);
    });
  });

  describe('create', () => {
    it('should send out a post request', (done) => {
      service.create(testBaseCreateTeamDto1, testOrganization1.slug).subscribe({
        next: (team) => {
          try {
            expect(team).toEqual(testTeam1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        TeamService.baseApiUrl(testOrganization1.slug),
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateTeamDto1);

      req.flush(testTeam1);
    });
  });

  describe('edit', () => {
    it('should send out a patch request', (done) => {
      service
        .edit(testOrganization1.slug, testTeam1.slug, testBaseUpdateTeamDto1)
        .subscribe({
          next: (team) => {
            try {
              expect(team).toEqual(testTeam1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const req = httpController.expectOne(
        `${TeamService.baseApiUrl(testOrganization1.slug)}/${testTeam1.slug}`,
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testBaseUpdateTeamDto1);

      req.flush(testTeam1);
    });
  });

  describe('delete', () => {
    it('should send out a delete request', (done) => {
      service.delete(testOrganization1.slug, testTeam1.slug).subscribe({
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
        `${TeamService.baseApiUrl(testOrganization1.slug)}/${testTeam1.slug}`,
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
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
        `${TeamService.baseApiUrl(testOrganization1.slug)}/${
          Keyword.CheckSlug
        }?${params.toString()}`,
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
        `${TeamService.baseApiUrl(testOrganization1.slug)}/${
          Keyword.GenerateSlug
        }?${params.toString()}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseGeneratedSlugDto1);
    });
  });

  describe('createTeamMember', () => {
    it('should send out a post request', (done) => {
      service
        .createTeamMember(
          testBaseCreateTeamMemberDto1,
          testOrganization1.slug,
          testTeam1.slug,
        )
        .subscribe({
          next: (teamMember) => {
            try {
              expect(teamMember).toEqual(testTeamMemberRelation1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const req = httpController.expectOne(
        TeamService.baseTeamMemberApiUrl(
          testOrganization1.slug,
          testTeam1.slug,
        ),
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateTeamMemberDto1);

      req.flush(testTeamMemberRelation1);
    });
  });

  describe('editTeamMember', () => {
    it('should send out a patch request', (done) => {
      service
        .editTeamMember(
          testBaseUpdateTeamMemberDto1,
          testOrganization1.slug,
          testTeam1.slug,
          testOrgMember1.slug,
        )
        .subscribe({
          next: (teamMember) => {
            try {
              expect(teamMember).toEqual(testTeamMember1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      const req = httpController.expectOne(
        `${TeamService.baseTeamMemberApiUrl(
          testOrganization1.slug,
          testTeam1.slug,
        )}/${testOrgMember1.slug}`,
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testBaseUpdateTeamMemberDto1);

      req.flush(testTeamMember1);
    });
  });

  describe('deleteTeamMember', () => {
    it('should send out a delete request', (done) => {
      service
        .deleteTeamMember(
          testOrganization1.slug,
          testTeam1.slug,
          testOrgMember1.slug,
        )
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
        `${TeamService.baseTeamMemberApiUrl(
          testOrganization1.slug,
          testTeam1.slug,
        )}/${testOrgMember1.slug}`,
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });
});
