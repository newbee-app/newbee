import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AccessTokenDto, UserJwtDto } from '@newbee/api/auth/util';
import { User } from '@newbee/api/shared/data-access';
import { AuthService } from './auth.service';

const accessToken1 = 'access_token1';

const oneAccessToken: AccessTokenDto = { access_token: accessToken1 };

const testId1 = '1';
const testEmail1 = 'johndoe@gmail.com';
const testFirstName1 = 'John';
const testLastName1 = 'Doe';

const oneUser = new User({
  id: testId1,
  email: testEmail1,
  firstName: testFirstName1,
  lastName: testLastName1,
});

const oneUserJwtDto: UserJwtDto = {
  email: testEmail1,
  sub: testId1,
};

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
            sign: jest.fn().mockReturnValue(accessToken1),
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
      expect(service.generateAccessToken(oneUser)).toEqual(oneAccessToken);
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(jwtService.sign).toBeCalledWith(oneUserJwtDto);
    });
  });
});
