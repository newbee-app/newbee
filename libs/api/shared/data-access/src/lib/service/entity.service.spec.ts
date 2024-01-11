import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';
import { testDocEntity1, testTeamEntity1 } from '../example';
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
});
