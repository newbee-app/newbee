import { createMock } from '@golevelup/ts-jest';
import { Collection } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AdminControlsEntity,
  EntityService,
  WaitlistMemberEntity,
  testAdminControlsEntity1,
  testWaitlistMemberEntity1,
} from '@newbee/api/shared/data-access';
import { WaitlistMemberService } from '@newbee/api/waitlist-member/data-access';
import { testUpdateAdminControlsDto1 } from '@newbee/shared/util';
import { AdminControlsService } from './admin-controls.service';

describe('AdminControlsService', () => {
  let service: AdminControlsService;
  let em: EntityManager;
  let entityService: EntityService;
  let waitlistMemberService: WaitlistMemberService;

  const testUpdatedAdminControls = {
    ...testAdminControlsEntity1,
    ...testUpdateAdminControlsDto1,
    waitlist: createMock<Collection<WaitlistMemberEntity>>({
      getItems: jest.fn().mockReturnValue([testWaitlistMemberEntity1]),
    }),
  } as AdminControlsEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminControlsService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testAdminControlsEntity1),
            assign: jest.fn().mockReturnValue(testUpdatedAdminControls),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            getAdminControls: jest
              .fn()
              .mockResolvedValue(testAdminControlsEntity1),
          }),
        },
        {
          provide: WaitlistMemberService,
          useValue: createMock<WaitlistMemberService>(),
        },
      ],
    }).compile();

    service = module.get(AdminControlsService);
    em = module.get(EntityManager);
    entityService = module.get(EntityService);
    waitlistMemberService = module.get(WaitlistMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(waitlistMemberService).toBeDefined();
  });

  describe('update', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
    });

    it('should update admin controls', async () => {
      await expect(
        service.update(testUpdateAdminControlsDto1),
      ).resolves.toEqual(testUpdatedAdminControls);
      expect(em.assign).toHaveBeenCalledWith(
        testAdminControlsEntity1,
        testUpdateAdminControlsDto1,
      );
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should remove everyone from the waitlist and turn them into users if turning registration on', async () => {
      await expect(
        service.update({
          ...testUpdateAdminControlsDto1,
          allowRegistration: true,
        }),
      ).resolves.toEqual(testUpdatedAdminControls);
      expect(em.assign).toHaveBeenCalledWith(testAdminControlsEntity1, {
        ...testUpdateAdminControlsDto1,
        allowRegistration: true,
      });
      expect(em.populate).toHaveBeenCalledTimes(1);
      expect(em.populate).toHaveBeenCalledWith(testUpdatedAdminControls, [
        'waitlist',
      ]);
      expect(waitlistMemberService.deleteAndCreateUsers).toHaveBeenCalledTimes(
        1,
      );
      expect(waitlistMemberService.deleteAndCreateUsers).toHaveBeenCalledWith([
        testWaitlistMemberEntity1,
      ]);
    });
  });
});
