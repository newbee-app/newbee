import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthService } from '@newbee/api/auth/data-access';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { authJwtCookie } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { testBaseCsrfTokenAndDataDto1 } from '@newbee/shared/data-access';
import { testUserRelation1 } from '@newbee/shared/util';
import { request, response } from 'express';
import { CookieController } from './cookie.controller';

describe('CookieController', () => {
  let controller: CookieController;
  let authService: AuthService;
  let userService: UserService;

  const testToken = 'token';
  const generateToken = jest.fn();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CookieController],
      providers: [
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockReturnValue(generateToken),
          }),
        },
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            verifyAuthToken: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            createUserRelation: jest.fn().mockResolvedValue(testUserRelation1),
          }),
        },
      ],
    }).compile();

    controller = module.get<CookieController>(CookieController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    request.signedCookies = {};
    request.signedCookies[authJwtCookie] = testToken;

    jest.clearAllMocks();
    generateToken.mockReturnValue(testBaseCsrfTokenAndDataDto1.csrfToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('initCookies', () => {
    afterEach(() => {
      expect(generateToken).toBeCalledTimes(1);
      expect(generateToken).toBeCalledWith(response, request);
    });

    it('should return a CSRF token and initial data as a DTO', async () => {
      await expect(controller.initCookies(request, response)).resolves.toEqual(
        testBaseCsrfTokenAndDataDto1
      );
      expect(authService.verifyAuthToken).toBeCalledTimes(1);
      expect(authService.verifyAuthToken).toBeCalledWith(testToken);
      expect(userService.createUserRelation).toBeCalledTimes(1);
      expect(userService.createUserRelation).toBeCalledWith(testUserEntity1);
    });

    it('should only return a CSRF token if request has no auth cookie', async () => {
      request.signedCookies = {};
      await expect(controller.initCookies(request, response)).resolves.toEqual({
        ...testBaseCsrfTokenAndDataDto1,
        userRelation: null,
      });
      expect(authService.verifyAuthToken).not.toBeCalled();
      expect(userService.createUserRelation).not.toBeCalled();
    });
  });
});
