import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { UserEntity, testUserEntity1 } from '@newbee/api/shared/data-access';
import {
  emailUnverifiedForbiddenError,
  testNow1,
  testNowDayjs1,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { EmailVerifiedGuard } from './email-verified.guard';

describe('EmailVerifiedGuard', () => {
  let reflector: Reflector;
  let guard: EmailVerifiedGuard;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = createMock<Reflector>({
      getAllAndOverride: jest.fn().mockReturnValue(false),
    });

    guard = new EmailVerifiedGuard(reflector);

    context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue(
        createMock<HttpArgumentsHost>({
          getRequest: jest.fn().mockReturnValue({ user: testUserEntity1 }),
        }),
      ),
    });

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(reflector).toBeDefined();
    expect(guard).toBeDefined();
    expect(context).toBeDefined();
  });

  it('should return true if public or unverified ok', () => {
    const badUser = {
      ...testUserEntity1,
      emailVerified: false,
      createdAt: testNowDayjs1.subtract(dayjs.duration('P14D')).toDate(),
    } as UserEntity;
    jest
      .spyOn(context.switchToHttp(), 'getRequest')
      .mockReturnValue({ user: badUser });
    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException(emailUnverifiedForbiddenError),
    );

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    expect(guard.canActivate(context)).toBeTruthy();
  });

  it('should return true if user has verified their email', () => {
    expect(guard.canActivate(context)).toBeTruthy();
  });

  it(`should only return true for unverified user if deadline hasn't hit yet`, () => {
    let badUser = { ...testUserEntity1, emailVerified: false } as UserEntity;
    jest
      .spyOn(context.switchToHttp(), 'getRequest')
      .mockReturnValue({ user: badUser });
    expect(guard.canActivate(context)).toBeTruthy();

    badUser = {
      ...badUser,
      createdAt: testNowDayjs1.subtract(dayjs.duration(2, 'weeks')).toDate(),
    };
    jest
      .spyOn(context.switchToHttp(), 'getRequest')
      .mockReturnValue({ user: badUser });
    expect(() => guard.canActivate(context)).toThrow(
      emailUnverifiedForbiddenError,
    );
  });
});
