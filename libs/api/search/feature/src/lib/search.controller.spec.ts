import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { SearchService } from '@newbee/api/search/data-access';
import { testOrganizationEntity1 } from '@newbee/api/shared/data-access';
import {
  testBaseQueryDto1,
  testBaseQueryResultDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultDto1,
} from '@newbee/shared/data-access';
import { SearchController } from './search.controller';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;
  let organizationService: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: createMock<SearchService>({
            query: jest.fn().mockResolvedValue(testBaseQueryResultDto1),
            suggest: jest.fn().mockResolvedValue(testBaseSuggestResultDto1),
          }),
        },
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            findOneBySlug: jest.fn().mockResolvedValue(testOrganizationEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(organizationService).toBeDefined();
  });

  describe('search & suggest', () => {
    afterEach(() => {
      expect(organizationService.findOneBySlug).toBeCalledTimes(1);
      expect(organizationService.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1.slug
      );
    });

    describe('search', () => {
      it('should generate search results', async () => {
        await expect(
          controller.search(testBaseQueryDto1, testOrganizationEntity1.slug)
        ).resolves.toEqual(testBaseQueryResultDto1);
        expect(service.query).toBeCalledTimes(1);
        expect(service.query).toBeCalledWith(
          testOrganizationEntity1,
          testBaseQueryDto1
        );
      });
    });

    describe('suggest', () => {
      it('should generate search suggestions', async () => {
        await expect(
          controller.suggest(testBaseSuggestDto1, testOrganizationEntity1.slug)
        ).resolves.toEqual(testBaseSuggestResultDto1);
        expect(service.suggest).toBeCalledTimes(1);
        expect(service.suggest).toBeCalledWith(
          testOrganizationEntity1,
          testBaseSuggestDto1
        );
      });
    });
  });
});
