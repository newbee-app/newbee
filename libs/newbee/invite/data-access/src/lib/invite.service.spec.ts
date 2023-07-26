import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion, testBaseTokenDto1 } from '@newbee/shared/data-access';
import { Keyword, testOrgMemberRelation1 } from '@newbee/shared/util';
import { InviteService } from './invite.service';

describe('InviteService', () => {
  let service: InviteService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InviteService],
    });

    service = TestBed.inject(InviteService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('acceptInvite', () => {
    it('should send out a post request', (done) => {
      service.acceptInvite(testBaseTokenDto1).subscribe({
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
        `/${Keyword.Api}/v${apiVersion.orgMemberInvite}/${Keyword.Invite}/${Keyword.Accept}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseTokenDto1);

      req.flush(testOrgMemberRelation1);
    });
  });

  describe('declineInvite', () => {
    it('should send out a post request', (done) => {
      service.declineInvite(testBaseTokenDto1).subscribe({
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
        `/${Keyword.Api}/v${apiVersion.orgMemberInvite}/${Keyword.Invite}/${Keyword.Decline}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseTokenDto1);

      req.flush(null);
    });
  });
});
