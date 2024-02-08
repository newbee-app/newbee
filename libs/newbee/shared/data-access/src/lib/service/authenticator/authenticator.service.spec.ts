import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  testAuthenticator1,
  testNameDto1,
  testPublicKeyCredentialCreationOptions1,
  testRegistrationResponse1,
  testRegistrationResponseDto1,
} from '@newbee/shared/util';
import { startRegistration } from '@simplewebauthn/browser';
import { of } from 'rxjs';
import { AuthenticatorService } from './authenticator.service';

jest.mock('@simplewebauthn/browser', () => ({
  __esModule: true,
  startRegistration: jest.fn(),
}));
const mockStartRegistration = startRegistration as jest.Mock;

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticatorService],
    });

    service = TestBed.inject(AuthenticatorService);
    httpController = TestBed.inject(HttpTestingController);

    jest.clearAllMocks();
    mockStartRegistration.mockReturnValue(of(testRegistrationResponse1));
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('baseApiUrl', () => {
    it('should match the expected API route', () => {
      expect(AuthenticatorService.baseApiUrl).toEqual(
        `/${Keyword.Api}/v${apiVersion.authenticator}/${Keyword.Authenticator}`,
      );
    });
  });

  describe('getAuthenticators', () => {
    it('should send out a get request', (done) => {
      service.getAuthenticators().subscribe({
        next: (authenticators) => {
          try {
            expect(authenticators).toEqual([testAuthenticator1]);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${Keyword.Api}/v${apiVersion.authenticator}/${Keyword.Authenticator}`,
      );
      expect(req.request.method).toEqual('GET');

      req.flush([testAuthenticator1]);
    });
  });

  describe('createOptions', () => {
    it('should send out a post request', (done) => {
      service.createOptions().subscribe({
        next: (options) => {
          try {
            expect(options).toEqual(testPublicKeyCredentialCreationOptions1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${Keyword.Api}/v${apiVersion.authenticator}/${Keyword.Authenticator}/${Keyword.Options}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({});

      req.flush(testPublicKeyCredentialCreationOptions1);
    });
  });

  describe('create', () => {
    it('should send out a post request', (done) => {
      service.create(testPublicKeyCredentialCreationOptions1).subscribe({
        next: (authenticator) => {
          try {
            expect(authenticator).toEqual(testAuthenticator1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${Keyword.Api}/v${apiVersion.authenticator}/${Keyword.Authenticator}`,
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testRegistrationResponseDto1);

      req.flush(testAuthenticator1);
    });
  });

  describe('editName', () => {
    it('should send out a patch request', (done) => {
      service.editName(testAuthenticator1.id, testNameDto1.name).subscribe({
        next: (authenticator) => {
          try {
            expect(authenticator).toEqual(testAuthenticator1);
            done();
          } catch (err) {
            done(err);
          }
        },
        error: done.fail,
      });

      const req = httpController.expectOne(
        `/${Keyword.Api}/v${apiVersion.authenticator}/${Keyword.Authenticator}/${testAuthenticator1.id}`,
      );
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.body).toEqual(testNameDto1);

      req.flush(testAuthenticator1);
    });
  });

  describe('delete', () => {
    it('should send out a delete request', (done) => {
      service.delete(testAuthenticator1.id).subscribe({
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
        `/${Keyword.Api}/v${apiVersion.authenticator}/${Keyword.Authenticator}/${testAuthenticator1.id}`,
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush(null);
    });
  });
});
