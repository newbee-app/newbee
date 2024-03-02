import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  DocEntity,
  EntityService,
  QnaEntity,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaEntity1,
} from '@newbee/api/shared/data-access';
import {
  testDocSearchResult1,
  testGetOrgMemberPostsDto1,
  testOffsetAndLimit1,
  testOrgMemberRelation1,
  testQnaSearchResult1,
  testUpdateOrgMemberDto1,
} from '@newbee/shared/util';
import { OrgMemberController } from './org-member.controller';

describe('OrgMemberController', () => {
  let controller: OrgMemberController;
  let service: OrgMemberService;
  let entityService: EntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgMemberController],
      providers: [
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            updateRole: jest.fn().mockResolvedValue(testOrgMemberEntity1),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createOrgMemberNoOrg: jest
              .fn()
              .mockResolvedValue(testOrgMemberRelation1),
            createDocSearchResults: jest
              .fn()
              .mockResolvedValue([testDocSearchResult1]),
            createQnaSearchResults: jest
              .fn()
              .mockResolvedValue([testQnaSearchResult1]),
          }),
        },
      ],
    }).compile();

    controller = module.get<OrgMemberController>(OrgMemberController);
    service = module.get<OrgMemberService>(OrgMemberService);
    entityService = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('getBySlug', () => {
    it('should return an org member and its relations', async () => {
      await expect(
        controller.getBySlug(testOrgMemberEntity1, testOrganizationEntity1),
      ).resolves.toEqual(testOrgMemberRelation1);
      expect(entityService.createOrgMemberNoOrg).toHaveBeenCalledTimes(1);
      expect(entityService.createOrgMemberNoOrg).toHaveBeenCalledWith(
        testOrgMemberEntity1,
      );
    });
  });

  describe('update', () => {
    it('should update an org member', async () => {
      await expect(
        controller.update(
          testUpdateOrgMemberDto1,
          testOrgMemberEntity1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual(testOrgMemberEntity1);
      expect(service.updateRole).toHaveBeenCalledTimes(1);
      expect(service.updateRole).toHaveBeenCalledWith(
        testOrgMemberEntity1,
        testUpdateOrgMemberDto1.role,
        testOrgMemberEntity1.role,
      );
    });
  });

  describe('delete', () => {
    it('should delete an org member', async () => {
      await expect(
        controller.delete(
          testOrgMemberEntity1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(testOrgMemberEntity1);
    });
  });

  describe('getAllDocs', () => {
    it('should get doc results', async () => {
      jest
        .spyOn(entityService, 'findPostsByOrgAndCount')
        .mockResolvedValue([[testDocEntity1], 1]);
      await expect(
        controller.getAllDocs(
          testGetOrgMemberPostsDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testDocSearchResult1],
      });
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledWith(
        DocEntity,
        testOffsetAndLimit1,
        testOrganizationEntity1,
        { orgMember: testOrgMemberEntity1 },
      );
      expect(entityService.createDocSearchResults).toHaveBeenCalledTimes(1);
      expect(entityService.createDocSearchResults).toHaveBeenCalledWith([
        testDocEntity1,
      ]);
    });
  });

  describe('getAllQnas', () => {
    it('should get qna results', async () => {
      jest
        .spyOn(entityService, 'findPostsByOrgAndCount')
        .mockResolvedValue([[testQnaEntity1], 1]);
      await expect(
        controller.getAllQnas(
          testGetOrgMemberPostsDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testQnaSearchResult1],
      });
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledWith(
        QnaEntity,
        testOffsetAndLimit1,
        testOrganizationEntity1,
        { orgMember: testOrgMemberEntity1 },
      );
      expect(entityService.createQnaSearchResults).toHaveBeenCalledTimes(1);
      expect(entityService.createQnaSearchResults).toHaveBeenCalledWith([
        testQnaEntity1,
      ]);
    });
  });
});
