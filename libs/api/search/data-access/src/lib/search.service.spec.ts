import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  testOrganizationEntity1,
  testQueryResponse1,
  testQueryResponse2,
  testQueryResponse3,
  testQueryResponse4,
  testQueryResponse5,
} from '@newbee/api/shared/data-access';
import {
  solrAppCollection,
  solrAppDictionaries,
  solrOrgDictionaries,
} from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  internalServerError,
  testAppSearchDto1,
  testAppSearchResultsDto1,
  testAppSuggestDto1,
  testOrgSearchDto1,
  testOrgSearchResultsDto1,
  testOrgSuggestDto1,
  testSuggestResultsDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let solrCli: SolrCli;
  let teamService: TeamService;
  let orgMemberService: OrgMemberService;

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
        {
          provide: TeamService,
          useValue: createMock<TeamService>(),
        },
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>(),
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    solrCli = module.get<SolrCli>(SolrCli);
    teamService = module.get<TeamService>(TeamService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(teamService).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('orgSuggest', () => {
    afterEach(() => {
      expect(solrCli.suggest).toHaveBeenCalledTimes(1);
      expect(solrCli.suggest).toHaveBeenCalledWith(testOrganizationEntity1.id, {
        params: {
          'suggest.q': testOrgSuggestDto1.query,
          'suggest.dictionary': solrOrgDictionaries.All,
        },
      });
    });

    it('should generate suggestions', async () => {
      await expect(
        service.orgSuggest(testOrganizationEntity1, testOrgSuggestDto1),
      ).resolves.toEqual(testSuggestResultsDto1);
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'suggest').mockRejectedValue(new Error('suggest'));
      await expect(
        service.orgSuggest(testOrganizationEntity1, testOrgSuggestDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('appSuggest', () => {
    afterEach(() => {
      expect(solrCli.suggest).toHaveBeenCalledTimes(1);
      expect(solrCli.suggest).toHaveBeenCalledWith(solrAppCollection, {
        params: {
          'suggest.q': testAppSuggestDto1.query,
          'suggest.dictionary': solrAppDictionaries.All,
        },
      });
    });

    it('should generate suggestions', async () => {
      jest.spyOn(solrCli, 'suggest').mockResolvedValue(testQueryResponse5);
      await expect(service.appSuggest(testAppSuggestDto1)).resolves.toEqual(
        testSuggestResultsDto1,
      );
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'suggest').mockRejectedValue(new Error('suggest'));
      await expect(service.appSuggest(testAppSuggestDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('orgSearch', () => {
    afterEach(() => {
      const { query, offset, limit } = testOrgSearchDto1;
      expect(solrCli.query).toHaveBeenCalledTimes(1);
      expect(solrCli.query).toHaveBeenCalledWith(testOrganizationEntity1.id, {
        query,
        offset,
        limit,
        filter: [],
        params: {
          'hl.q': query,
          'spellcheck.q': query,
          'spellcheck.dictionary': solrOrgDictionaries.All,
        },
      });
    });

    it('should generate results', async () => {
      await expect(
        service.orgSearch(testOrganizationEntity1, testOrgSearchDto1),
      ).resolves.toEqual(testOrgSearchResultsDto1);
    });

    it('should offer spellcheck suggestions if no results', async () => {
      jest.spyOn(solrCli, 'query').mockResolvedValue(testQueryResponse2);
      await expect(
        service.orgSearch(testOrganizationEntity1, testOrgSearchDto1),
      ).resolves.toEqual({
        total: testQueryResponse2.response?.numFound,
        offset: testOrgSearchDto1.offset,
        limit: testOrgSearchDto1.limit,
        results: [],
        query: testOrgSearchDto1.query,
        suggestion:
          testQueryResponse2.spellcheck?.collations[1]?.collationQuery,
      });
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'query').mockRejectedValue(new Error('query'));
      await expect(
        service.orgSearch(testOrganizationEntity1, testOrgSearchDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('appSearch', () => {
    afterEach(() => {
      const { query, offset, limit } = testAppSearchDto1;
      expect(solrCli.query).toHaveBeenCalledTimes(1);
      expect(solrCli.query).toHaveBeenCalledWith(solrAppCollection, {
        query,
        offset,
        limit,
        filter: [],
        params: {
          'hl.q': query,
          'spellcheck.q': query,
          'spellcheck.dictionary': solrAppDictionaries.All,
        },
      });
    });

    it('should generate results', async () => {
      jest.spyOn(solrCli, 'query').mockResolvedValue(testQueryResponse4);
      await expect(service.appSearch(testAppSearchDto1)).resolves.toEqual(
        testAppSearchResultsDto1,
      );
    });

    it('should offer spellcheck suggestions if no results', async () => {
      jest.spyOn(solrCli, 'query').mockResolvedValue(testQueryResponse2);
      await expect(service.appSearch(testAppSearchDto1)).resolves.toEqual({
        total: testQueryResponse2.response?.numFound,
        offset: testAppSearchDto1.offset,
        limit: testAppSearchDto1.limit,
        results: [],
        query: testAppSearchDto1.query,
        suggestion:
          testQueryResponse2.spellcheck?.collations[1]?.collationQuery,
      });
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'query').mockRejectedValue(new Error('query'));
      await expect(service.appSearch(testAppSearchDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });
});
