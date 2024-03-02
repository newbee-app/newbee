import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthService } from '@newbee/api/auth/data-access';
import { EntityService, testUserEntity1 } from '@newbee/api/shared/data-access';
import { authJwtCookie } from '@newbee/api/shared/util';
import {
  testCsrfTokenAndDataDto1,
  testPublicAdminControls1,
  testUserRelation1,
} from '@newbee/shared/util';
import { request, response } from 'express';
import { CookieController } from './cookie.controller';

describe('CookieController', () => {
  let controller: CookieController;
  let entityService: EntityService;
  let authService: AuthService;

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
          provide: EntityService,
          useValue: createMock<EntityService>({
            createUserRelation: jest.fn().mockResolvedValue(testUserRelation1),
            getPublicAdminControls: jest
              .fn()
              .mockResolvedValue(testPublicAdminControls1),
          }),
        },
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            verifyAuthToken: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get(CookieController);
    authService = module.get(AuthService);
    entityService = module.get(EntityService);

    request.signedCookies = {};
    request.signedCookies[authJwtCookie] = testToken;

    jest.clearAllMocks();
    generateToken.mockReturnValue(testCsrfTokenAndDataDto1.csrfToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('initCookies', () => {
    afterEach(() => {
      expect(generateToken).toHaveBeenCalledTimes(1);
      expect(generateToken).toHaveBeenCalledWith(request, response, true);
      expect(entityService.getPublicAdminControls).toHaveBeenCalledTimes(1);
    });

    it('should return a CSRF token and initial data as a DTO', async () => {
      await expect(controller.initCookies(request, response)).resolves.toEqual(
        testCsrfTokenAndDataDto1,
      );
      expect(authService.verifyAuthToken).toHaveBeenCalledTimes(1);
      expect(authService.verifyAuthToken).toHaveBeenCalledWith(testToken);
      expect(entityService.createUserRelation).toHaveBeenCalledTimes(1);
      expect(entityService.createUserRelation).toHaveBeenCalledWith(
        testUserEntity1,
      );
    });

    it('should only return a CSRF token if request has no auth cookie', async () => {
      request.signedCookies = {};
      await expect(controller.initCookies(request, response)).resolves.toEqual({
        ...testCsrfTokenAndDataDto1,
        userRelation: null,
      });
      expect(authService.verifyAuthToken).not.toHaveBeenCalled();
      expect(entityService.createUserRelation).not.toHaveBeenCalled();
    });

    it('should only return a CSRF token if verify returns null', async () => {
      jest.spyOn(authService, 'verifyAuthToken').mockResolvedValue(null);
      await expect(controller.initCookies(request, response)).resolves.toEqual({
        ...testCsrfTokenAndDataDto1,
        userRelation: null,
      });
      expect(authService.verifyAuthToken).toHaveBeenCalledTimes(1);
      expect(authService.verifyAuthToken).toHaveBeenCalledWith(
        request.signedCookies[authJwtCookie],
      );
      expect(entityService.createUserRelation).not.toHaveBeenCalled();
    });
  });
});
