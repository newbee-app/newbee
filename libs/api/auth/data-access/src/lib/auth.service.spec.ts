import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserJwtPayload } from '@newbee/api/auth/util';
import { LoginDto, User } from '@newbee/shared/data-access';
import { AuthService } from './auth.service';

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

const oneUserJwtDto: UserJwtPayload = {
  email: testEmail1,
  sub: testId1,
};

const accessToken1 = 'access_token1';

const oneLoginDto: LoginDto = { access_token: accessToken1, user: oneUser };

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
      expect(service.login(oneUser)).toEqual(oneLoginDto);
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(jwtService.sign).toBeCalledWith(oneUserJwtDto);
    });
  });
});
