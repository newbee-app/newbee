import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminControlsService } from '@newbee/api/admin-controls/data-access';
import {
  EntityService,
  testAdminControlsEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testAdminControlsRelation1,
  testUpdateAdminControlsDto1,
} from '@newbee/shared/util';
import { AdminControlsController } from './admin-controls.controller';

describe('AdminControlsController', () => {
  let controller: AdminControlsController;
  let service: AdminControlsService;
  let entityService: EntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminControlsController],
      providers: [
        {
          provide: AdminControlsService,
          useValue: createMock<AdminControlsService>({
            get: jest.fn().mockResolvedValue(testAdminControlsEntity1),
            update: jest.fn().mockResolvedValue(testAdminControlsEntity1),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createAdminControlsRelation: jest
              .fn()
              .mockResolvedValue(testAdminControlsRelation1),
          }),
        },
      ],
    }).compile();

    controller = module.get<AdminControlsController>(AdminControlsController);
    service = module.get<AdminControlsService>(AdminControlsService);
    entityService = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('get', () => {
    it('should get admin controls', async () => {
      await expect(controller.get(testUserEntity1)).resolves.toEqual(
        testAdminControlsRelation1,
      );
      expect(service.get).toHaveBeenCalledTimes(1);
      expect(entityService.createAdminControlsRelation).toHaveBeenCalledTimes(
        1,
      );
      expect(entityService.createAdminControlsRelation).toHaveBeenCalledWith(
        testAdminControlsEntity1,
      );
    });
  });

  describe('update', () => {
    it('should update admin controls', async () => {
      await expect(
        controller.update(testUpdateAdminControlsDto1, testUserEntity1),
      ).resolves.toEqual(testAdminControlsEntity1);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(testUpdateAdminControlsDto1);
    });
  });
});
