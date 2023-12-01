import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EntityService,
  UserInvitesEntity,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { internalServerError } from '@newbee/shared/util';
import { v4 } from 'uuid';
import { UserInvitesService } from './user-invites.service';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  UserInvitesEntity: jest.fn(),
}));
const mockUserInvitesEntity = UserInvitesEntity as jest.Mock;

describe('UserInvitesService', () => {
  let service: UserInvitesService;
  let em: EntityManager;
  let entityService: EntityService;

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
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
      ],
    }).compile();

    service = module.get<UserInvitesService>(UserInvitesService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);

    jest.clearAllMocks();
    mockV4.mockReturnValue(testUserInvitesEntity1.id);
    mockUserInvitesEntity.mockReturnValue(testUserInvitesEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
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

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOrCreateOneByEmail(testUserInvitesEntity1.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    describe('nothing found, must create', () => {
      beforeEach(() => {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
      });

      afterEach(() => {
        expect(mockUserInvitesEntity).toHaveBeenCalledTimes(1);
        expect(mockUserInvitesEntity).toHaveBeenCalledWith(
          testUserInvitesEntity1.id,
          testUserInvitesEntity1.email,
        );
        expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
        expect(em.persistAndFlush).toHaveBeenCalledWith(testUserInvitesEntity1);
      });

      it('should create a user invites', async () => {
        await expect(
          service.findOrCreateOneByEmail(testUserInvitesEntity1.email),
        ).resolves.toEqual(testUserInvitesEntity1);
      });

      it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
        jest
          .spyOn(em, 'persistAndFlush')
          .mockRejectedValue(new Error('persistAndFlush'));
        await expect(
          service.findOrCreateOneByEmail(testUserInvitesEntity1.email),
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
      });
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(
        testUserInvitesEntity1,
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testUserInvitesEntity1);
    });

    it('should delete a user invites object', async () => {
      await expect(
        service.delete(testUserInvitesEntity1),
      ).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testUserInvitesEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });
});
