import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { testLoginForm1, testRegisterForm1 } from '@newbee/newbee/auth/util';
import {
  authUrl,
  authVersion,
  loginUrl,
  optionsUrl,
  registerUrl,
  testBaseCreateUserDto1,
  testBaseEmailDto1,
  testBaseMagicLinkLoginDto1,
  testBaseUserAndOptionsDto1,
  testBaseWebAuthnLoginDto1,
  webauthnUrl,
} from '@newbee/shared/data-access';
import {
  magicLinkLogin,
  testAuthenticationCredential1,
  testPublicKeyCredentialRequestOptions1,
  testUser1,
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
    it('should send out a post request', (done) => {
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

      const req = httpController.expectOne(
        `/api/v${authVersion}/${authUrl}/${magicLinkLogin}/${loginUrl}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseEmailDto1);

      req.flush(testBaseMagicLinkLoginDto1);
    });
  });

  describe('magicLinkLogin', () => {
    it('should send out a post request', (done) => {
      service.magicLinkLogin('1234').subscribe({
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
        `/api/v${authVersion}/${authUrl}/${magicLinkLogin}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ token: '1234' });

      req.flush(testUser1);
    });
  });

  describe('webAuthnRegister', () => {
    it('should send out a post request', (done) => {
      service.webAuthnRegister(testRegisterForm1).subscribe({
        next: (userAndOptionsDto) => {
          try {
            expect(userAndOptionsDto).toEqual(testBaseUserAndOptionsDto1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/api/v${authVersion}/${authUrl}/${webauthnUrl}/${registerUrl}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateUserDto1);

      req.flush(testBaseUserAndOptionsDto1);
    });
  });

  describe('webAuthnLoginOptions', () => {
    it('should send out a post request', (done) => {
      service.webAuthnLoginOptions(testLoginForm1).subscribe({
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

      const req = httpController.expectOne(
        `/api/v${authVersion}/${authUrl}/${webauthnUrl}/${loginUrl}/${optionsUrl}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseEmailDto1);

      req.flush(testPublicKeyCredentialRequestOptions1);
    });
  });

  describe('webauthnLogin', () => {
    it('should send out a post request', (done) => {
      service
        .webAuthnLogin(testLoginForm1, testPublicKeyCredentialRequestOptions1)
        .subscribe({
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

      expect(mockStartAuthentication).toBeCalledTimes(1);
      expect(mockStartAuthentication).toBeCalledWith(
        testPublicKeyCredentialRequestOptions1
      );

      const req = httpController.expectOne(
        `/api/v${authVersion}/${authUrl}/${webauthnUrl}/${loginUrl}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseWebAuthnLoginDto1);

      req.flush(testUser1);
    });
  });
});
