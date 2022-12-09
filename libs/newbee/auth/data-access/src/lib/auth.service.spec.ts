import { HttpParams } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { testLoginForm1, testRegisterForm1 } from '@newbee/newbee/auth/util';
import {
  auth,
  authVersion,
  login,
  register,
  testBaseCreateUserDto1,
  testBaseEmailDto1,
  testBaseLoginDto1,
  testBaseMagicLinkLoginDto1,
  testBaseUserCreatedDto1,
  testBaseWebAuthnLoginDto1,
  webauthn,
} from '@newbee/shared/data-access';
import {
  magicLinkLogin,
  testAuthenticationCredential1,
  testPublicKeyCredentialRequestOptions1,
} from '@newbee/shared/util';
import { startAuthentication } from '@simplewebauthn/browser';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

jest.mock('@simplewebauthn/browser', () => ({
  __esModule: true,
  startAuthentication: jest.fn(),
}));
const mockStartAuthentication = startAuthentication as jest.Mock;

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

    jest.clearAllMocks();
    mockStartAuthentication.mockReturnValue(of(testAuthenticationCredential1));
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('magicLinkLoginLogin', () => {
    it('should send out a get request', (done) => {
      service.magicLinkLoginLogin(testLoginForm1).subscribe({
        next: (magicLinkLoginDto) => {
          try {
            expect(magicLinkLoginDto).toEqual(testBaseMagicLinkLoginDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { ...testBaseEmailDto1 } });
      const req = httpController.expectOne(
        `/api/v${authVersion}/${auth}/${magicLinkLogin}/${login}?${params.toString()}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseMagicLinkLoginDto1);
    });
  });

  describe('magicLinkLogin', () => {
    it('should send out a get request', (done) => {
      service.magicLinkLogin('1234').subscribe({
        next: (loginDto) => {
          try {
            expect(loginDto).toEqual(testBaseLoginDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { token: '1234' } });
      const req = httpController.expectOne(
        `/api/v${authVersion}/${auth}/${magicLinkLogin}?${params.toString()}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testBaseLoginDto1);
    });
  });

  describe('webAuthnRegister', () => {
    it('should send out a get request', (done) => {
      service.webAuthnRegister(testRegisterForm1).subscribe({
        next: (userCreatedDto) => {
          try {
            expect(userCreatedDto).toEqual(testBaseUserCreatedDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/api/v${authVersion}/${auth}/${webauthn}/${register}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateUserDto1);

      req.flush(testBaseUserCreatedDto1);
    });
  });

  describe('webAuthnLoginGet', () => {
    it('should send out a get request', (done) => {
      service.webAuthnLoginGet(testLoginForm1).subscribe({
        next: (options) => {
          try {
            expect(options).toEqual(testPublicKeyCredentialRequestOptions1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const params = new HttpParams({ fromObject: { ...testBaseEmailDto1 } });
      const req = httpController.expectOne(
        `/api/v${authVersion}/${auth}/${webauthn}/${login}?${params.toString()}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testPublicKeyCredentialRequestOptions1);
    });
  });

  describe('webauthnLoginPost', () => {
    it('should send out a post request', (done) => {
      service
        .webAuthnLoginPost(
          testLoginForm1,
          testPublicKeyCredentialRequestOptions1
        )
        .subscribe({
          next: (loginDto) => {
            try {
              expect(loginDto).toEqual(testBaseLoginDto1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      expect(mockStartAuthentication).toBeCalledTimes(1);
      expect(mockStartAuthentication).toBeCalledWith(
        testPublicKeyCredentialRequestOptions1
      );

      const req = httpController.expectOne(
        `/api/v${authVersion}/${auth}/${webauthn}/${login}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseWebAuthnLoginDto1);

      req.flush(testBaseLoginDto1);
    });
  });
});
