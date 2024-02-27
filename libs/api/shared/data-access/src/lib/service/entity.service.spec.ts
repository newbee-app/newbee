import { createMock } from '@golevelup/ts-jest';
import { QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { adminControlsId } from '@newbee/api/shared/util';
import {
  defaultLimit,
  internalServerError,
  testNow1,
  testOffsetAndLimit1,
  testPublicAdminControls1,
  testPublicUser1,
  testPublicUser2,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import { AdminControlsEntity, DocEntity } from '../entity';
import {
  testAdminControlsEntity1,
  testDocEntity1,
  testOrganizationEntity1,
  testTeamEntity1,
  testUserEntity1,
  testUserEntity2,
  testWaitlistMemberEntity1,
} from '../example';
import { EntityService } from './entity.service';

jest.mock('../entity', () => ({
  __esModule: true,
  ...jest.requireActual('../entity'),
  AdminControlsEntity: jest.fn(),
}));
const mockAdminControlsEntity = AdminControlsEntity as jest.Mock;

describe('EntityService', () => {
  let service: EntityService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>(),
        },
      ],
    }).compile();

    service = module.get<EntityService>(EntityService);
    em = module.get<EntityManager>(EntityManager);

    jest.clearAllMocks();
    mockAdminControlsEntity.mockReturnValue(testAdminControlsEntity1);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
  });

  describe('getAdminControls, getPublicAdminControls, getAdminControlsRelation', () => {
    beforeEach(() => {
      jest.spyOn(em, 'findOne').mockResolvedValue(testAdminControlsEntity1);
      jest
        .spyOn(em, 'findAndCount')
        .mockResolvedValue([[testWaitlistMemberEntity1], 1]);
    });

    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(
        AdminControlsEntity,
        adminControlsId,
      );
    });

    describe('getAdminControls', () => {
      it('should return a found admin controls if one is found', async () => {
        await expect(service.getAdminControls()).resolves.toEqual(
          testAdminControlsEntity1,
        );
      });

      it('should create admin controls if none are found', async () => {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        await expect(service.getAdminControls()).resolves.toEqual(
          testAdminControlsEntity1,
        );
        expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
        expect(em.persistAndFlush).toHaveBeenCalledWith(
          testAdminControlsEntity1,
        );
      });

      it('should throw an InternalServerErrorException if findOne throws an error', async () => {
        jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
        await expect(service.getAdminControls()).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
      });

      it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
        jest.spyOn(em, 'findOne').mockResolvedValue(null);
        jest
          .spyOn(em, 'persistAndFlush')
          .mockRejectedValue(new Error('persistAndFlush'));
        await expect(service.getAdminControls()).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
      });
    });

    describe('getPublicAdminControls', () => {
      it('should return public admin controls', async () => {
        await expect(service.getPublicAdminControls()).resolves.toEqual(
          testPublicAdminControls1,
        );
      });
    });

    describe('getAdminControlsRelation', () => {
      it('should return admin controls relation', async () => {
        await expect(service.getAdminControlsRelation()).resolves.toEqual({
          adminControls: testAdminControlsEntity1,
          waitlist: {
            results: [testWaitlistMemberEntity1],
            total: 1,
            offset: 0,
            limit: defaultLimit,
          },
        });
      });

      it('should throw InternalServerErrorException if findAndCount throws an error', async () => {
        jest
          .spyOn(em, 'findAndCount')
          .mockRejectedValue(new Error('findAndCount'));
        await expect(service.getAdminControlsRelation()).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
      });
    });
  });

  describe('trueUpToDateDuration', () => {
    it('should work with no new duration or team', () => {
      expect(
        EntityService.trueUpToDateDuration(
          testDocEntity1,
          undefined,
          undefined,
        ),
      ).toEqual(
        dayjs.duration(
          testDocEntity1.upToDateDuration ??
            testDocEntity1.team?.upToDateDuration ??
            testDocEntity1.organization.upToDateDuration,
        ),
      );
    });

    it('should account for new up-to-date duration value', () => {
      expect(
        EntityService.trueUpToDateDuration(testDocEntity1, 'P2Y', undefined),
      ).toEqual(dayjs.duration('P2Y'));
    });

    it('should account for new team value', () => {
      expect(
        EntityService.trueUpToDateDuration(testDocEntity1, undefined, {
          ...testTeamEntity1,
          upToDateDuration: 'P2Y',
        }),
      ).toEqual(dayjs.duration('P2Y'));
    });
  });

  describe('findPostsByOrgAndCount', () => {
    beforeEach(() => {
      jest.spyOn(em, 'findAndCount').mockResolvedValue([[testDocEntity1], 1]);
    });

    afterEach(() => {
      expect(em.findAndCount).toHaveBeenCalledTimes(1);
    });

    describe('only org', () => {
      afterEach(() => {
        expect(em.findAndCount).toHaveBeenCalledWith(
          DocEntity,
          { organization: testOrganizationEntity1 },
          {
            ...testOffsetAndLimit1,
            orderBy: { markedUpToDateAt: QueryOrder.DESC },
          },
        );
      });

      it('should find doc entities and count', async () => {
        await expect(
          service.findPostsByOrgAndCount(
            DocEntity,
            testOffsetAndLimit1,
            testOrganizationEntity1,
          ),
        ).resolves.toEqual([[testDocEntity1], 1]);
      });

      it('should throw an InternalServerErrorException if findAndCount throws an error', async () => {
        jest
          .spyOn(em, 'findAndCount')
          .mockRejectedValue(new Error('findAndCount'));
        await expect(
          service.findPostsByOrgAndCount(
            DocEntity,
            testOffsetAndLimit1,
            testOrganizationEntity1,
          ),
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
      });
    });

    describe('org and optional params', () => {
      afterEach(() => {
        expect(em.findAndCount).toHaveBeenCalledWith(
          DocEntity,
          { organization: testOrganizationEntity1, team: testTeamEntity1 },
          {
            ...testOffsetAndLimit1,
            orderBy: { markedUpToDateAt: QueryOrder.DESC },
          },
        );
      });

      it('should accept team if specified', async () => {
        await expect(
          service.findPostsByOrgAndCount(
            DocEntity,
            testOffsetAndLimit1,
            testOrganizationEntity1,
            { team: testTeamEntity1 },
          ),
        ).resolves.toEqual([[testDocEntity1], 1]);
      });
    });
  });

  describe('createPublicUser', () => {
    it('should convert user entity into public user', () => {
      expect(EntityService.createPublicUser(testUserEntity1)).toEqual(
        testPublicUser1,
      );
      expect(EntityService.createPublicUser(testUserEntity2)).toEqual(
        testPublicUser2,
      );
    });
  });
});
