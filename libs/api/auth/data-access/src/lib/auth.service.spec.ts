import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { testUserJwtPayload1 } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { testLoginDto1 } from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { AuthService } from './auth.service';

const { fullName, ...rest } = testUser1;
fullName; // to shut up the unused var warning
const testUserEntity1 = new UserEntity(rest);

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
