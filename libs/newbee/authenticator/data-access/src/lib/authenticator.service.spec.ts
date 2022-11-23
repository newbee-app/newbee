import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authenticatorVersion } from '@newbee/shared/data-access';
import {
  testAuthenticator1,
  testPublicKeyCredentialCreationOptions1,
  testRegistrationCredential1,
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
    mockStartRegistration.mockReturnValue(of(testRegistrationCredential1));
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('createGet', () => {
    it('should send out a get request', (done) => {
      service.createGet().subscribe({
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
        `/api/v${authenticatorVersion}/authenticator/create`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(testPublicKeyCredentialCreationOptions1);
    });
  });

  describe('createPost', () => {
    it('should send out a post request', (done) => {
      service.createPost(testPublicKeyCredentialCreationOptions1).subscribe({
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
        `/api/v${authenticatorVersion}/authenticator/create`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testRegistrationCredential1);

      req.flush(testAuthenticator1);
    });
  });
});
