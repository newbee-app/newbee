import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  EntityService,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateOrganizationDto1,
  testBaseGenerateSlugDto1,
  testBaseGeneratedSlugDto1,
  testBaseSlugDto1,
  testBaseSlugTakenDto1,
  testBaseUpdateOrganizationDto1,
} from '@newbee/shared/data-access';
import {
  testOrgMemberRelation1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import slug from 'slug';
import { OrganizationController } from './organization.controller';

describe('OrganizationController', () => {
  let controller: OrganizationController;
  let service: OrganizationService;
  let entityService: EntityService;

  const testUpdatedOrganizationEntity = {
    ...testOrganizationEntity1,
    ...testBaseUpdateOrganizationDto1,
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
            createOrgTeams: jest
              .fn()
              .mockResolvedValue(testOrganizationRelation1),
            createOrgMemberNoUserOrg: jest
              .fn()
              .mockResolvedValue(testOrgMemberRelation1),
          }),
        },
      ],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service = module.get<OrganizationService>(OrganizationService);
    entityService = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('create', () => {
    it('should create an organization', async () => {
      await expect(
        controller.create(testBaseCreateOrganizationDto1, testUserEntity1),
      ).resolves.toEqual(testOrganizationEntity1);
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testBaseCreateOrganizationDto1,
        testUserEntity1,
      );
    });
  });

  describe('checkSlug', () => {
    it('should return true if slug is taken, false if not', async () => {
      await expect(controller.checkSlug(testBaseSlugDto1)).resolves.toEqual(
        testBaseSlugTakenDto1,
      );
      expect(service.hasOneBySlug).toBeCalledTimes(1);
      expect(service.hasOneBySlug).toBeCalledWith(testBaseSlugDto1.slug);

      jest.spyOn(service, 'hasOneBySlug').mockResolvedValue(false);
      await expect(controller.checkSlug(testBaseSlugDto1)).resolves.toEqual({
        slugTaken: false,
      });
      expect(service.hasOneBySlug).toBeCalledTimes(2);
      expect(service.hasOneBySlug).toBeCalledWith(testBaseSlugDto1.slug);
    });
  });

  describe('generateSlug', () => {
    it('should generate a unique slug', async () => {
      jest.spyOn(service, 'hasOneBySlug').mockResolvedValue(false);
      const sluggedBase = slug(testBaseGenerateSlugDto1.base);
      await expect(
        controller.generateSlug(testBaseGenerateSlugDto1),
      ).resolves.toEqual(testBaseGeneratedSlugDto1);
      expect(service.hasOneBySlug).toBeCalledTimes(1);
      expect(service.hasOneBySlug).toBeCalledWith(sluggedBase);
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
      expect(entityService.createOrgTeams).toBeCalledTimes(1);
      expect(entityService.createOrgTeams).toBeCalledWith(
        testOrganizationEntity1,
      );
      expect(entityService.createOrgMemberNoUserOrg).toBeCalledTimes(1);
      expect(entityService.createOrgMemberNoUserOrg).toBeCalledWith(
        testOrgMemberEntity1,
      );
    });
  });

  describe('update', () => {
    it('should find and update an organization', async () => {
      await expect(
        controller.update(
          testOrganizationEntity1,
          testBaseUpdateOrganizationDto1,
        ),
      ).resolves.toEqual(testUpdatedOrganizationEntity);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testOrganizationEntity1,
        testBaseUpdateOrganizationDto1,
      );
    });
  });

  describe('delete', () => {
    it('should delete the organization', async () => {
      await expect(
        controller.delete(testOrganizationEntity1),
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testOrganizationEntity1);
    });
  });
});
