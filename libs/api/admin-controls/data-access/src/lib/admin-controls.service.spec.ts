import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AdminControlsEntity,
  testAdminControlsEntity1,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { adminControlsId } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  internalServerError,
  testUpdateAdminControlsDto1,
  testUser1,
} from '@newbee/shared/util';
import { AdminControlsService } from './admin-controls.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  AdminControlsEntity: jest.fn(),
}));
const mockAdminControlsEntity = AdminControlsEntity as jest.Mock;

describe('AdminControlsService', () => {
  let service: AdminControlsService;
  let em: EntityManager;
  let userInvitesService: UserInvitesService;

  const testUpdatedAdminControls = new AdminControlsEntity();
  Object.assign(testUpdatedAdminControls, testUpdateAdminControlsDto1);

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
          provide: UserInvitesService,
          useValue: createMock<UserInvitesService>({
            findOrCreateOneByEmail: jest
              .fn()
              .mockResolvedValue(testUserInvitesEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get<AdminControlsService>(AdminControlsService);
    em = module.get<EntityManager>(EntityManager);
    userInvitesService = module.get<UserInvitesService>(UserInvitesService);

    jest.clearAllMocks();
    mockAdminControlsEntity.mockReturnValue(testAdminControlsEntity1);
    jest
      .spyOn(testAdminControlsEntity1.waitlist, 'add')
      .mockReturnValue(undefined);
    jest
      .spyOn(testAdminControlsEntity1.waitlist, 'remove')
      .mockReturnValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(userInvitesService).toBeDefined();
  });

  describe('get', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(
        AdminControlsEntity,
        adminControlsId,
      );
    });

    it('should return a found admin controls if one is found', async () => {
      await expect(service.get()).resolves.toEqual(testAdminControlsEntity1);
    });

    it('should create admin controls if none are found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(service.get()).resolves.toEqual(testAdminControlsEntity1);
      expect(mockAdminControlsEntity).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testAdminControlsEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(service.get()).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(service.get()).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(
        testAdminControlsEntity1,
        testUpdateAdminControlsDto1,
      );
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update admin controls', async () => {
      await expect(
        service.update(testUpdateAdminControlsDto1),
      ).resolves.toEqual(testUpdatedAdminControls);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(service.update(testUpdateAdminControlsDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('addToWaitlist', () => {
    afterEach(() => {
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledTimes(
        1,
      );
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledWith(
        testUser1.email,
      );
      expect(testAdminControlsEntity1.waitlist.add).toHaveBeenCalledTimes(1);
      expect(testAdminControlsEntity1.waitlist.add).toHaveBeenCalledWith([
        testUserInvitesEntity1,
      ]);
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should add emails to waitlist', async () => {
      await expect(service.addToWaitlist([testUser1.email])).resolves.toEqual(
        testAdminControlsEntity1,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(service.addToWaitlist([testUser1.email])).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('removeFromWaitlist', () => {
    afterEach(() => {
      expect(testAdminControlsEntity1.waitlist.remove).toHaveBeenCalledTimes(1);
      expect(testAdminControlsEntity1.waitlist.remove).toHaveBeenCalledWith([
        testUserInvitesEntity1,
      ]);
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should remove emails from the waitlist', async () => {
      await expect(
        service.removeFromWaitlist([testUserInvitesEntity1]),
      ).resolves.toEqual(testAdminControlsEntity1);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.removeFromWaitlist([testUserInvitesEntity1]),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });
});
