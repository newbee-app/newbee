import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  testOrganizationEntity1,
  testQueryResponse1,
  testQueryResponse2,
  testQueryResponse3,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  testBaseQueryDto1,
  testBaseQueryResultDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let solrCli: SolrCli;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
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
    solrCli = module.get<SolrCli>(SolrCli);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('suggest', () => {
    describe('calls suggest once', () => {
      afterEach(() => {
        expect(solrCli.suggest).toBeCalledTimes(1);
        expect(solrCli.suggest).toBeCalledWith(testOrganizationEntity1.id, {
          params: { 'suggest.q': testBaseSuggestDto1.query },
        });
      });

      it('should generate suggestions', async () => {
        await expect(
          service.suggest(testOrganizationEntity1, testBaseSuggestDto1),
        ).resolves.toEqual(testBaseSuggestResultDto1);
      });

      it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
        jest.spyOn(solrCli, 'suggest').mockRejectedValue(new Error('suggest'));
        await expect(
          service.suggest(testOrganizationEntity1, testBaseSuggestDto1),
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
      });
    });
  });

  describe('query', () => {
    afterEach(() => {
      const { query } = testBaseQueryDto1;
      expect(solrCli.query).toBeCalledTimes(1);
      expect(solrCli.query).toBeCalledWith(testOrganizationEntity1.id, {
        query,
        offset: testBaseQueryDto1.offset,
        params: { 'hl.q': query, 'spellcheck.q': query },
      });
    });

    it('should generate results', async () => {
      await expect(
        service.query(testOrganizationEntity1, testBaseQueryDto1),
      ).resolves.toEqual(testBaseQueryResultDto1);
    });

    it('should offer spellcheck suggestions if no results', async () => {
      jest.spyOn(solrCli, 'query').mockResolvedValue(testQueryResponse2);
      await expect(
        service.query(testOrganizationEntity1, testBaseQueryDto1),
      ).resolves.toEqual({
        total: testQueryResponse2.response?.numFound,
        offset: testBaseQueryDto1.offset,
        results: [],
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

  describe('buildSuggester', () => {
    it('should call suggest with build parameter', async () => {
      await expect(
        service.buildSuggester(testOrganizationEntity1),
      ).resolves.toBeUndefined();
      expect(solrCli.suggest).toBeCalledTimes(1);
      expect(solrCli.suggest).toBeCalledWith(testOrganizationEntity1.id, {
        params: { 'suggest.build': true },
      });
    });
  });
});
