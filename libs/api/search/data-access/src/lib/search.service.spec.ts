import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  testOrganizationEntity1,
  testQueryResponse1,
  testQueryResponse2,
  testQueryResponse3,
} from '@newbee/api/shared/data-access';
import { solrDictionaries } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  internalServerError,
  testQueryDto1,
  testQueryResultsDto1,
  testSuggestDto1,
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
    teamService = module.get<TeamService>(TeamService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
    solrCli = module.get<SolrCli>(SolrCli);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(teamService).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('suggest', () => {
    afterEach(() => {
      expect(solrCli.suggest).toHaveBeenCalledTimes(1);
      expect(solrCli.suggest).toHaveBeenCalledWith(testOrganizationEntity1.id, {
        params: {
          'suggest.q': testSuggestDto1.query,
          'suggest.dictionary': solrDictionaries.all,
        },
      });
    });

    it('should generate suggestions', async () => {
      await expect(
        service.suggest(testOrganizationEntity1, testSuggestDto1),
      ).resolves.toEqual(testSuggestResultsDto1);
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'suggest').mockRejectedValue(new Error('suggest'));
      await expect(
        service.suggest(testOrganizationEntity1, testSuggestDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('query', () => {
    afterEach(() => {
      const { query } = testQueryDto1;
      expect(solrCli.query).toHaveBeenCalledTimes(1);
      expect(solrCli.query).toHaveBeenCalledWith(testOrganizationEntity1.id, {
        query,
        offset: testQueryDto1.offset,
        limit: testQueryDto1.limit,
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
        service.query(testOrganizationEntity1, testQueryDto1),
      ).resolves.toEqual(testQueryResultsDto1);
    });

    it('should offer spellcheck suggestions if no results', async () => {
      jest.spyOn(solrCli, 'query').mockResolvedValue(testQueryResponse2);
      await expect(
        service.query(testOrganizationEntity1, testQueryDto1),
      ).resolves.toEqual({
        total: testQueryResponse2.response?.numFound,
        offset: testQueryDto1.offset,
        limit: testQueryDto1.limit,
        results: [],
        query: testQueryDto1.query,
        suggestion:
          testQueryResponse2.spellcheck?.collations[1]?.collationQuery,
      });
    });

    it('should throw an InternalServerErrorException if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'query').mockRejectedValue(new Error('query'));
      await expect(
        service.query(testOrganizationEntity1, testQueryDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });
});
