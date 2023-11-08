import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testAuthenticationCredential1,
  testBaseCreateUserDto1,
  testBaseEmailDto1,
  testBaseMagicLinkLoginDto1,
  testBaseUserRelationAndOptionsDto1,
  testBaseWebAuthnLoginDto1,
  testPublicKeyCredentialRequestOptions1,
  testUserRelation1,
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

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(AuthService.baseApiUrl).toEqual(
        `/${Keyword.Api}/v${apiVersion.auth}/${Keyword.Auth}`,
      );
    });
  });

  describe('magicLinkLoginLogin', () => {
    it('should send out a post request', (done) => {
      service.magicLinkLoginLogin(testBaseEmailDto1).subscribe({
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
        `${AuthService.baseApiUrl}/${Keyword.MagicLinkLogin}/${Keyword.Login}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseEmailDto1);

      req.flush(testBaseMagicLinkLoginDto1);
    });
  });

  describe('magicLinkLogin', () => {
    it('should send out a post request', (done) => {
      service.magicLinkLogin('1234').subscribe({
        next: (userRelation) => {
          try {
            expect(userRelation).toEqual(testUserRelation1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${AuthService.baseApiUrl}/${Keyword.MagicLinkLogin}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ token: '1234' });

      req.flush(testUserRelation1);
    });
  });

  describe('webAuthnRegister', () => {
    it('should send out a post request', (done) => {
      service.webAuthnRegister(testBaseCreateUserDto1).subscribe({
        next: (userRelationAndOptionsDto) => {
          try {
            expect(userRelationAndOptionsDto).toEqual(
              testBaseUserRelationAndOptionsDto1,
            );
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${AuthService.baseApiUrl}/${Keyword.WebAuthn}/${Keyword.Register}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseCreateUserDto1);

      req.flush(testBaseUserRelationAndOptionsDto1);
    });
  });

  describe('webAuthnLoginOptions', () => {
    it('should send out a post request', (done) => {
      service.webAuthnLoginOptions(testBaseEmailDto1).subscribe({
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
        `${AuthService.baseApiUrl}/${Keyword.WebAuthn}/${Keyword.Login}/${Keyword.Options}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseEmailDto1);

      req.flush(testPublicKeyCredentialRequestOptions1);
    });
  });

  describe('webauthnLogin', () => {
    it('should send out a post request', (done) => {
      service
        .webAuthnLogin(
          testBaseEmailDto1,
          testPublicKeyCredentialRequestOptions1,
        )
        .subscribe({
          next: (userRelation) => {
            try {
              expect(userRelation).toEqual(testUserRelation1);
              done();
            } catch (err) {
              done(err);
            }
          },
          error: done.fail,
        });

      expect(mockStartAuthentication).toBeCalledTimes(1);
      expect(mockStartAuthentication).toBeCalledWith(
        testPublicKeyCredentialRequestOptions1,
      );

      const req = httpController.expectOne(
        `${AuthService.baseApiUrl}/${Keyword.WebAuthn}/${Keyword.Login}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseWebAuthnLoginDto1);

      req.flush(testUserRelation1);
    });
  });

  describe('logout', () => {
    it('should send out a post request', (done) => {
      service.logout().subscribe({
        next: () => {
          try {
            expect(true).toBeTruthy();
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `${AuthService.baseApiUrl}/${Keyword.Logout}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({});

      req.flush(null);
    });
  });
});
