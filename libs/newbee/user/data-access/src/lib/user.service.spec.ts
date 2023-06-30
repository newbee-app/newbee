import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  testBaseUpdateUserDto1,
  UrlEndpoint,
  userVersion,
} from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
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

  describe('edit', () => {
    it('should send out an patch request', (done) => {
      service.edit(testBaseUpdateUserDto1).subscribe({
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
        `/${UrlEndpoint.Api}/v${userVersion}/${UrlEndpoint.User}`
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testBaseUpdateUserDto1);

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

      const req = httpController.expectOne(
        `/${UrlEndpoint.Api}/v${userVersion}/${UrlEndpoint.User}`
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });
});
