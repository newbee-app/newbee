import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import {
  testDocDocParams1,
  testDocEntity1,
  testOrgMemberDocParams1,
  testOrgMemberEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamDocParams1,
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

  describe('create solr doc params', () => {
    it('should create DocDocParams using a doc entity', () => {
      expect(service.createDocDocParams(testDocEntity1)).toEqual(
        testDocDocParams1
      );
    });

    it('should create QnaDocParams using a qna entity', () => {
      expect(service.createQnaDocParams(testQnaEntity1)).toEqual(
        testQnaDocParams1
      );
    });

    it('should create TeamDocParams using a team entity', () => {
      expect(service.createTeamDocParams(testTeamEntity1)).toEqual(
        testTeamDocParams1
      );
    });

    it('should create OrgMemberDocParams using an org member entity', async () => {
      await expect(
        service.createOrgMemberDocParams(testOrgMemberEntity1)
      ).resolves.toEqual(testOrgMemberDocParams1);
    });
  });
});
