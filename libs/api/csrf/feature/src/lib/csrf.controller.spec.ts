import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { testBaseCsrfTokenDto1 } from '@newbee/shared/data-access';
import { request, response } from 'express';
import { CsrfController } from './csrf.controller';

describe('CsrfController', () => {
  let controller: CsrfController;

  const generateToken = jest
    .fn()
    .mockReturnValue(testBaseCsrfTokenDto1.csrfToken);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CsrfController],
      providers: [
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockReturnValue(generateToken),
          }),
        },
      ],
    }).compile();

    controller = module.get<CsrfController>(CsrfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createToken', () => {
    it('should return a CSRF token as a DTO', () => {
      expect(controller.createToken(request, response)).toEqual(
        testBaseCsrfTokenDto1
      );
      expect(generateToken).toBeCalledTimes(1);
      expect(generateToken).toBeCalledWith(response, request);
    });
  });
});
