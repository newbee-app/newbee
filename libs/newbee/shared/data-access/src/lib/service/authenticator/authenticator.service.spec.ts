import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  authenticator,
  authenticatorVersion,
  options,
  testBaseRegistrationResponseDto1,
} from '@newbee/shared/data-access';
import {
  testAuthenticator1,
  testPublicKeyCredentialCreationOptions1,
  testRegistrationResponse1,
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
        `/api/v${authenticatorVersion}/${authenticator}/${options}`
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
        `/api/v${authenticatorVersion}/${authenticator}`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testBaseRegistrationResponseDto1);

      req.flush(testAuthenticator1);
    });
  });
});
