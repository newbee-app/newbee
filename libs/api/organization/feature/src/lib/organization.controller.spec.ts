import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { SearchService } from '@newbee/api/search/data-access';
import {
  EntityService,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testCreateOrganizationDto1,
  testGenerateSlugDto1,
  testGeneratedSlugDto1,
  testOrgMemberRelation1,
  testOrgSearchDto1,
  testOrgSearchResultsDto1,
  testOrgSuggestDto1,
  testOrganizationRelation1,
  testSlugDto1,
  testSlugTakenDto1,
  testSuggestResultsDto1,
  testUpdateOrganizationDto1,
} from '@newbee/shared/util';
import slug from 'slug';
import { OrganizationController } from './organization.controller';

describe('OrganizationController', () => {
  let controller: OrganizationController;
  let service: OrganizationService;
  let entityService: EntityService;
  let searchService: SearchService;

  const testUpdatedOrganizationEntity = {
    ...testOrganizationEntity1,
    ...testUpdateOrganizationDto1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            create: jest.fn().mockResolvedValue(testOrganizationEntity1),
            hasOneBySlug: jest.fn().mockResolvedValue(true),
            update: jest.fn().mockResolvedValue(testUpdatedOrganizationEntity),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createOrgTeamsMembers: jest
              .fn()
              .mockResolvedValue(testOrganizationRelation1),
            createOrgMemberNoUserOrg: jest
              .fn()
              .mockResolvedValue(testOrgMemberRelation1),
          }),
        },
        {
          provide: SearchService,
          useValue: createMock<SearchService>({
            orgSuggest: jest.fn().mockResolvedValue(testSuggestResultsDto1),
            orgSearch: jest.fn().mockResolvedValue(testOrgSearchResultsDto1),
          }),
        },
      ],
    }).compile();

    controller = module.get(OrganizationController);
    service = module.get(OrganizationService);
    entityService = module.get(EntityService);
    searchService = module.get(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
    expect(searchService).toBeDefined();
  });

  describe('create', () => {
    it('should create an organization', async () => {
      await expect(
        controller.create(testCreateOrganizationDto1, testUserEntity1),
      ).resolves.toEqual(testOrganizationEntity1);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        testCreateOrganizationDto1,
        testUserEntity1,
      );
    });
  });

  describe('checkSlug', () => {
    it('should return true if slug is taken, false if not', async () => {
      await expect(controller.checkSlug(testSlugDto1)).resolves.toEqual(
        testSlugTakenDto1,
      );
      expect(service.hasOneBySlug).toHaveBeenCalledTimes(1);
      expect(service.hasOneBySlug).toHaveBeenCalledWith(testSlugDto1.slug);

      jest.spyOn(service, 'hasOneBySlug').mockResolvedValue(false);
      await expect(controller.checkSlug(testSlugDto1)).resolves.toEqual({
        slugTaken: false,
      });
      expect(service.hasOneBySlug).toHaveBeenCalledTimes(2);
      expect(service.hasOneBySlug).toHaveBeenCalledWith(testSlugDto1.slug);
    });
  });

  describe('generateSlug', () => {
    it('should generate a unique slug', async () => {
      jest.spyOn(service, 'hasOneBySlug').mockResolvedValue(false);
      const sluggedBase = slug(testGenerateSlugDto1.base);
      await expect(
        controller.generateSlug(testGenerateSlugDto1),
      ).resolves.toEqual(testGeneratedSlugDto1);
      expect(service.hasOneBySlug).toHaveBeenCalledTimes(1);
      expect(service.hasOneBySlug).toHaveBeenCalledWith(sluggedBase);
    });
  });

  describe('get', () => {
    it('should find and return an organization', async () => {
      await expect(
        controller.get(testOrganizationEntity1, testOrgMemberEntity1),
      ).resolves.toEqual({
        organization: testOrganizationRelation1,
        orgMember: testOrgMemberRelation1,
      });
      expect(entityService.createOrgTeamsMembers).toHaveBeenCalledTimes(1);
      expect(entityService.createOrgTeamsMembers).toHaveBeenCalledWith(
        testOrganizationEntity1,
      );
      expect(entityService.createOrgMemberNoUserOrg).toHaveBeenCalledTimes(1);
      expect(entityService.createOrgMemberNoUserOrg).toHaveBeenCalledWith(
        testOrgMemberEntity1,
      );
    });
  });

  describe('update', () => {
    it('should find and update an organization', async () => {
      await expect(
        controller.update(testOrganizationEntity1, testUpdateOrganizationDto1),
      ).resolves.toEqual(testUpdatedOrganizationEntity);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testUpdateOrganizationDto1,
      );
    });
  });

  describe('delete', () => {
    it('should delete the organization', async () => {
      await expect(
        controller.delete(testOrganizationEntity1),
      ).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(testOrganizationEntity1);
    });
  });

  describe('suggest', () => {
    it('should return suggest results', async () => {
      await expect(
        controller.suggest(testOrgSuggestDto1, testOrganizationEntity1),
      ).resolves.toEqual(testSuggestResultsDto1);
      expect(searchService.orgSuggest).toHaveBeenCalledTimes(1);
      expect(searchService.orgSuggest).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testOrgSuggestDto1,
      );
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      await expect(
        controller.search(testOrgSearchDto1, testOrganizationEntity1),
      ).resolves.toEqual(testOrgSearchResultsDto1);
      expect(searchService.orgSearch).toHaveBeenCalledTimes(1);
      expect(searchService.orgSearch).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testOrgSearchDto1,
      );
    });
  });
});
