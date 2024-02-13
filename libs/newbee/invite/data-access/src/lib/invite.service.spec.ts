import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  Keyword,
  testOrgMemberRelation1,
  testTokenDto1,
} from '@newbee/shared/util';
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
      service.acceptInvite(testTokenDto1).subscribe({
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
        `${InviteService.baseApiUrl}/${Keyword.Accept}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testTokenDto1);

      req.flush(testOrgMemberRelation1);
    });
  });

  describe('declineInvite', () => {
    it('should send out a post request', (done) => {
      service.declineInvite(testTokenDto1).subscribe({
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
        `${InviteService.baseApiUrl}/${Keyword.Decline}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testTokenDto1);

      req.flush(null);
    });
  });
});
