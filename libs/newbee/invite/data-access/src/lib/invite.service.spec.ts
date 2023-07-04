import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  orgMemberInviteVersion,
  testBaseTokenDto1,
  UrlEndpoint,
} from '@newbee/shared/data-access';
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
        `/${UrlEndpoint.Api}/v${orgMemberInviteVersion}/${UrlEndpoint.Invite}/${UrlEndpoint.Accept}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseTokenDto1);

      req.flush(null);
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
        `/${UrlEndpoint.Api}/v${orgMemberInviteVersion}/${UrlEndpoint.Invite}/${UrlEndpoint.Decline}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseTokenDto1);

      req.flush(null);
    });
  });
});
