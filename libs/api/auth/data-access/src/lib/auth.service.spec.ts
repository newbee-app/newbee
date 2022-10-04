import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { testUserJwtPayload1 } from '@newbee/api/auth/util';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { testLoginDto1 } from '@newbee/shared/data-access';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: createMock<JwtService>({
            sign: jest.fn().mockReturnValue(testLoginDto1.access_token),
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken()', () => {
    it('should return access token', () => {
      expect(service.login(testUserEntity1)).toEqual({
        access_token: testLoginDto1.access_token,
        user: testUserEntity1,
      });
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(jwtService.sign).toBeCalledWith(testUserJwtPayload1);
    });
  });
});
