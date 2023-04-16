import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  testUserInvitesEntity1,
  UserInvitesEntity,
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
  let repository: EntityRepository<UserInvitesEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInvitesService,
        {
          provide: getRepositoryToken(UserInvitesEntity),
          useValue: createMock<EntityRepository<UserInvitesEntity>>({
            findOne: jest.fn().mockResolvedValue(testUserInvitesEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get<UserInvitesService>(UserInvitesService);
    repository = module.get<EntityRepository<UserInvitesEntity>>(
      getRepositoryToken(UserInvitesEntity)
    );

    jest.clearAllMocks();
    mockV4.mockReturnValue(testUserInvitesEntity1.id);
    mockUserInvitesEntity.mockReturnValue(testUserInvitesEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findOrCreateOneByEmail', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        email: testUserInvitesEntity1.email,
      });
    });

    it('should return a found user invites if one is found', async () => {
      await expect(
        service.findOrCreateOneByEmail(testUserInvitesEntity1.email)
      ).resolves.toEqual(testUserInvitesEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOrCreateOneByEmail(testUserInvitesEntity1.email)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    describe('nothing found, must create', () => {
      beforeEach(() => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      });

      afterEach(() => {
        expect(mockUserInvitesEntity).toBeCalledTimes(1);
        expect(mockUserInvitesEntity).toBeCalledWith(
          testUserInvitesEntity1.id,
          testUserInvitesEntity1.email
        );
        expect(repository.persistAndFlush).toBeCalledTimes(1);
        expect(repository.persistAndFlush).toBeCalledWith(
          testUserInvitesEntity1
        );
      });

      it('should create a user invites', async () => {
        await expect(
          service.findOrCreateOneByEmail(testUserInvitesEntity1.email)
        ).resolves.toEqual(testUserInvitesEntity1);
      });

      it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
        jest
          .spyOn(repository, 'persistAndFlush')
          .mockRejectedValue(new Error('persistAndFlush'));
        await expect(
          service.findOrCreateOneByEmail(testUserInvitesEntity1.email)
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError)
        );
      });
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(testUserInvitesEntity1.removeAllCollections).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testUserInvitesEntity1);
    });

    it('should delete a user invites object', async () => {
      await expect(
        service.delete(testUserInvitesEntity1)
      ).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testUserInvitesEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });
  });
});
