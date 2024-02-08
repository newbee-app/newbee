import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '@newbee/api/search/data-access';
import { testOrganizationEntity1 } from '@newbee/api/shared/data-access';
import {
  testQueryDto1,
  testQueryResultsDto1,
  testSuggestDto1,
  testSuggestResultsDto1,
} from '@newbee/shared/util';
import { SearchController } from './search.controller';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: createMock<SearchService>({
            query: jest.fn().mockResolvedValue(testQueryResultsDto1),
            suggest: jest.fn().mockResolvedValue(testSuggestResultsDto1),
          }),
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should generate search results', async () => {
      await expect(
        controller.search(testQueryDto1, testOrganizationEntity1),
      ).resolves.toEqual(testQueryResultsDto1);
      expect(service.query).toHaveBeenCalledTimes(1);
      expect(service.query).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testQueryDto1,
      );
    });
  });

  describe('suggest', () => {
    it('should generate search suggestions', async () => {
      await expect(
        controller.suggest(testSuggestDto1, testOrganizationEntity1),
      ).resolves.toEqual(testSuggestResultsDto1);
      expect(service.suggest).toHaveBeenCalledTimes(1);
      expect(service.suggest).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testSuggestDto1,
      );
    });
  });
});
