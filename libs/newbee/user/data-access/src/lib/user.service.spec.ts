import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testTokenDto1,
  testUpdateUserDto1,
  testUser1,
} from '@newbee/shared/util';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(UserService.baseApiUrl).toEqual(
        `/${Keyword.Api}/v${apiVersion.user}/${Keyword.User}`,
      );
    });
  });

  describe('edit', () => {
    it('should send out an patch request', (done) => {
      service.edit(testUpdateUserDto1).subscribe({
        next: (user) => {
          try {
            expect(user).toEqual(testUser1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(UserService.baseApiUrl);
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testUpdateUserDto1);

      req.flush(testUser1);
    });
  });

  describe('delete', () => {
    it('should send out a delete request', (done) => {
      service.delete().subscribe({
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

      const req = httpController.expectOne(UserService.baseApiUrl);
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });

  describe('verifyEmail', () => {
    it('should send out a post request', (done) => {
      service.verifyEmail(testTokenDto1.token).subscribe({
        next: (user) => {
          try {
            expect(user).toEqual(testUser1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${UserService.baseApiUrl}/${Keyword.Verify}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testTokenDto1);

      req.flush(testUser1);
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send out a post request', (done) => {
      service.sendVerificationEmail().subscribe({
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

      const req = httpController.expectOne(UserService.baseApiUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({});

      req.flush(null);
    });
  });
});
