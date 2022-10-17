import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  authVersion,
  testCreateUserDto1,
  testMagicLinkLoginDto1,
  testMagicLinkLoginLoginDto1,
} from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpController).toBeDefined();
  });

  describe('login()', () => {
    it('should send out a post request', (done) => {
      service.login(testMagicLinkLoginLoginDto1).subscribe({
        next: (magicLinkLoginDto) => {
          expect(magicLinkLoginDto).toEqual(testMagicLinkLoginDto1);
          done();
        },
        error: done.fail,
      });
      const req = httpController.expectOne(
        `/api/v${authVersion}/auth/${magicLinkLogin}/login`
      );
      expect(req.request.method).toEqual('POST');

      req.flush(testMagicLinkLoginDto1);
      httpController.verify();
    });
  });

  describe('register()', () => {
    it('should send out a post request', (done) => {
      service.register(testCreateUserDto1).subscribe({
        next: (magicLinkLoginDto) => {
          expect(magicLinkLoginDto).toEqual(testMagicLinkLoginDto1);
          done();
        },
        error: done.fail,
      });
      const req = httpController.expectOne(
        `/api/v${authVersion}/auth/${magicLinkLogin}/register`
      );
      expect(req.request.method).toEqual('POST');

      req.flush(testMagicLinkLoginDto1);
      httpController.verify();
    });
  });
});