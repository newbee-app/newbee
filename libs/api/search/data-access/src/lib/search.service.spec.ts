import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  testOrganizationEntity1,
  testQueryResponse1,
  testQueryResponse2,
  testQueryResponse3,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { solrDictionaries } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  internalServerError,
  testBaseQueryDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultsDto1,
  testQueryResults1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let teamService: TeamService;
  let solrCli: SolrCli;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            findOneBySlug: jest.fn().mockResolvedValue(testTeamEntity1),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>({
            query: jest.fn().mockResolvedValue(testQueryResponse1),
            suggest: jest.fn().mockResolvedValue(testQueryResponse3),
          }),
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    teamService = module.get<TeamService>(TeamService);
    solrCli = module.get<SolrCli>(SolrCli);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(teamService).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('suggest', () => {
    afterEach(() => {
      expect(solrCli.suggest).toHaveBeenCalledTimes(1);
      expect(solrCli.suggest).toHaveBeenCalledWith(testOrganizationEntity1.id, {
        params: {
          'suggest.q': testBaseSuggestDto1.query,
          'suggest.dictionary': solrDictionaries.all,
        },
      });
    });

    it('should generate suggestions', async () => {
      await expect(
        service.suggest(testOrganizationEntity1, testBaseSuggestDto1),
      ).resolves.toEqual(testBaseSuggestResultsDto1);
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'suggest').mockRejectedValue(new Error('suggest'));
      await expect(
        service.suggest(testOrganizationEntity1, testBaseSuggestDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('query', () => {
    afterEach(() => {
      const { query } = testBaseQueryDto1;
      expect(solrCli.query).toHaveBeenCalledTimes(1);
      expect(solrCli.query).toHaveBeenCalledWith(testOrganizationEntity1.id, {
        query,
        offset: testBaseQueryDto1.offset,
        limit: testBaseQueryDto1.limit,
        filter: [],
        params: {
          'hl.q': query,
          'spellcheck.q': query,
          'spellcheck.dictionary': solrDictionaries.all,
        },
      });
    });

    it('should generate results', async () => {
      await expect(
        service.query(testOrganizationEntity1, testBaseQueryDto1),
      ).resolves.toEqual(testQueryResults1);
    });

    it('should offer spellcheck suggestions if no results', async () => {
      jest.spyOn(solrCli, 'query').mockResolvedValue(testQueryResponse2);
      await expect(
        service.query(testOrganizationEntity1, testBaseQueryDto1),
      ).resolves.toEqual({
        total: testQueryResponse2.response?.numFound,
        offset: testBaseQueryDto1.offset,
        limit: testBaseQueryDto1.limit,
        results: [],
        query: testBaseQueryDto1.query,
        suggestion:
          testQueryResponse2.spellcheck?.collations[1]?.collationQuery,
      });
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'query').mockRejectedValue(new Error('query'));
      await expect(
        service.query(testOrganizationEntity1, testBaseQueryDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('buildSuggesters', () => {
    it('should call suggest with build parameter', async () => {
      await expect(
        service.buildSuggesters(testOrganizationEntity1),
      ).resolves.toBeUndefined();
      expect(solrCli.suggest).toHaveBeenCalledTimes(
        Object.values(solrDictionaries).length,
      );
      Object.values(solrDictionaries).forEach((dictionary) => {
        expect(solrCli.suggest).toHaveBeenCalledWith(
          testOrganizationEntity1.id,
          {
            params: { 'suggest.build': true, 'suggest.dictionary': dictionary },
          },
        );
      });
    });
  });
});
