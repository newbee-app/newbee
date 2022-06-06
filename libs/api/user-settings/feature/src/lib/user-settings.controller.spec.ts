import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { User, UserSettings } from '@newbee/api/shared/data-access';
import { NameDisplayFormat } from '@newbee/api/shared/util';
import { UserSettingsService } from '@newbee/api/user-settings/data-access';
import { UpdateUserSettingsDto } from '@newbee/api/user-settings/util';
import { UserSettingsController } from './user-settings.controller';

const testId1 = '1';
const testEmail1 = 'johndoe@gmail.com';
const testFirstName1 = 'John';
const testLastName1 = 'Doe';
const testNameDisplayFormat1 = NameDisplayFormat.FIRST_LAST;

const oneUser = new User({
  id: testId1,
  email: testEmail1,
  firstName: testFirstName1,
  lastName: testLastName1,
});

const oneUserSettings = new UserSettings({
  user: oneUser,
  nameDisplayFormat: testNameDisplayFormat1,
});

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
            update: jest.fn().mockResolvedValue(oneUserSettings),
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
        nameDisplayFormat: testNameDisplayFormat1,
      };
      await expect(
        controller.update(testId1, updateUserSettingsDto)
      ).resolves.toEqual(oneUserSettings);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(testId1, updateUserSettingsDto);
    });
  });
});
