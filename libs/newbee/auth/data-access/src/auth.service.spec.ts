import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  authVersion,
  CreateUserDto,
  MagicLinkLoginLoginDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin, testUser1 } from '@newbee/shared/util';
import { AuthService } from './auth.service';

const testEmail1 = testUser1.email;

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
  });

  describe('login()', () => {
    it('should send out a post request', () => {
      const magicLinkLoginLoginDto: MagicLinkLoginLoginDto = {
        email: testEmail1,
      };
      service
        .login(magicLinkLoginLoginDto)
        .subscribe((httpResponse) => expect(httpResponse.ok).toBeTruthy());
      const req = httpController.expectOne(
        `/api/v${authVersion}/auth/${magicLinkLogin}/login`
      );
      expect(req.request.method).toEqual('POST');

      req.flush(null);
      httpController.verify();
    });
  });

  describe('register()', () => {
    it('should send out a post request', () => {
      const createUserDto: CreateUserDto = Object.assign({}, testUser1);
      service
        .register(createUserDto)
        .subscribe((httpResponse) => expect(httpResponse.ok).toBeTruthy());
      const req = httpController.expectOne(
        `/api/v${authVersion}/auth/${magicLinkLogin}/register`
      );
      expect(req.request.method).toEqual('POST');

      req.flush(null);
      httpController.verify();
    });
  });
});
