import { createMock } from '@golevelup/ts-jest';
import { QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { internalServerError, testOffsetAndLimit1 } from '@newbee/shared/util';
import dayjs from 'dayjs';
import { DocEntity } from '../entity';
import {
  testDocEntity1,
  testOrganizationEntity1,
  testTeamEntity1,
} from '../example';
import { EntityService } from './entity.service';

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
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
});
