import { createMock } from '@golevelup/ts-jest';
import { MethodNotAllowedException } from '@nestjs/common';
import {
  EntityService,
  testAdminControlsEntity1,
} from '@newbee/api/shared/data-access';
import {
  registerNotWaitlistMethodNotAllowed,
  waitlistClosedMethodNotAllowed,
} from '@newbee/shared/util';
import { WaitlistGuard } from './waitlist.guard';

describe('WaitlistGuard', () => {
  let entityService: EntityService;
  let guard: WaitlistGuard;

  beforeEach(() => {
    entityService = createMock<EntityService>({
      getAdminControls: jest.fn().mockResolvedValue(testAdminControlsEntity1),
    });
    guard = new WaitlistGuard(entityService);
  });

  it('should be defined', () => {
    expect(entityService).toBeDefined();
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    afterEach(() => {
      expect(entityService.getAdminControls).toHaveBeenCalledTimes(1);
    });

    it('should throw if registration is open', async () => {
      await expect(guard.canActivate()).rejects.toThrow(
        new MethodNotAllowedException(registerNotWaitlistMethodNotAllowed),
      );
    });

    it('should throw if registration is closed and waitlist is closed', async () => {
      jest
        .spyOn(entityService, 'getAdminControls')
        .mockResolvedValue({
          ...testAdminControlsEntity1,
          allowRegistration: false,
          allowWaitlist: false,
        });
      await expect(guard.canActivate()).rejects.toThrow(
        new MethodNotAllowedException(waitlistClosedMethodNotAllowed),
      );
    });

    it('should return true if registration is closed and waitlist is open', async () => {
      jest
        .spyOn(entityService, 'getAdminControls')
        .mockResolvedValue({
          ...testAdminControlsEntity1,
          allowRegistration: false,
        });
      await expect(guard.canActivate()).resolves.toBeTruthy();
    });
  });
});
