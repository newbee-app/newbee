import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import {
  UserInvitesEntity,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { UserInvitesService } from './user-invites.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  UserInvitesEntity: jest.fn(),
}));
const mockUserInvitesEntity = UserInvitesEntity as jest.Mock;

describe('UserInvitesService', () => {
  let service: UserInvitesService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInvitesService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testUserInvitesEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get(UserInvitesService);
    em = module.get(EntityManager);

    jest.clearAllMocks();
    mockUserInvitesEntity.mockReturnValue(testUserInvitesEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
  });

  describe('findOrCreateOneByEmail', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(UserInvitesEntity, {
        email: testUserInvitesEntity1.email,
      });
    });

    it('should return a found user invites if one is found', async () => {
      await expect(
        service.findOrCreateOneByEmail(testUserInvitesEntity1.email),
      ).resolves.toEqual(testUserInvitesEntity1);
    });

    it('should create a user invites if not found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOrCreateOneByEmail(testUserInvitesEntity1.email),
      ).resolves.toEqual(testUserInvitesEntity1);
      expect(mockUserInvitesEntity).toHaveBeenCalledTimes(1);
      expect(mockUserInvitesEntity).toHaveBeenCalledWith(
        testUserInvitesEntity1.email,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testUserInvitesEntity1);
    });
  });

  describe('delete', () => {
    it('should delete a user invites object', async () => {
      await expect(
        service.delete(testUserInvitesEntity1),
      ).resolves.toBeUndefined();
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testUserInvitesEntity1);
    });
  });
});
