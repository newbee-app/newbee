import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserSettings } from '@newbee/api/shared/data-access';
import { NameDisplayFormat } from '@newbee/api/shared/util';
import { UpdateUserSettingsDto } from '@newbee/api/user-settings/util';
import { UserService } from '@newbee/api/user/data-access';
import { Repository } from 'typeorm';
import { UserSettingsService } from './user-settings.service';

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

const oneUserSettings = new UserSettings({
  user: oneUser,
  nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
});

describe('UserSettingsService', () => {
  let service: UserSettingsService;
  let repository: Repository<UserSettings>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSettingsService,
        {
          provide: UserService,
          useValue: createMock<UserService>({
            findOneById: jest.fn().mockResolvedValue(oneUser),
          }),
        },
        {
          provide: getRepositoryToken(UserSettings),
          useValue: createMock<Repository<UserSettings>>({
            findOne: jest.fn().mockResolvedValue(oneUserSettings),
            save: jest.fn().mockResolvedValue(oneUserSettings),
          }),
        },
      ],
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
    repository = module.get<Repository<UserSettings>>(
      getRepositoryToken(UserSettings)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById()', () => {
    it(`should get a single user's settings by id`, async () => {
      await expect(service.findOneById(testId1)).resolves.toEqual(
        oneUserSettings
      );
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({ where: { id: testId1 } });
    });
  });

  describe('update()', () => {
    it(`should try to find and update a user's settings by id`, async () => {
      const updateUserSettingsDto: UpdateUserSettingsDto = {
        nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
      };
      await expect(
        service.update(testId1, updateUserSettingsDto)
      ).resolves.toEqual(oneUserSettings);
      expect(repository.findOne).toBeCalledTimes(0);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        ...updateUserSettingsDto,
        user: oneUser,
      });
    });
  });
});
