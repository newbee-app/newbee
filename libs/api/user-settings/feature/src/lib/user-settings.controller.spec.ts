import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { testUserSettingsEntity1 } from '@newbee/api/shared/data-access';
import { UserSettingsService } from '@newbee/api/user-settings/data-access';
import { UpdateUserSettingsDto } from '@newbee/shared/data-access';
import { testUserSettings1 } from '@newbee/shared/util';
import { UserSettingsController } from './user-settings.controller';

describe('UserSettingsController', () => {
  let controller: UserSettingsController;
  let service: UserSettingsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserSettingsController],
      providers: [
        {
          provide: UserSettingsService,
          useValue: createMock<UserSettingsService>({
            update: jest.fn().mockResolvedValue(testUserSettingsEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserSettingsController>(UserSettingsController);
    service = module.get<UserSettingsService>(UserSettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update()', () => {
    it(`should try to find and update a user's settings by id`, async () => {
      const updateUserSettingsDto: UpdateUserSettingsDto = {
        nameDisplayFormat: testUserSettings1.nameDisplayFormat,
      };
      await expect(
        controller.update(testUserSettings1.id, updateUserSettingsDto)
      ).resolves.toEqual(testUserSettingsEntity1);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testUserSettings1.id,
        updateUserSettingsDto
      );
    });
  });
});
