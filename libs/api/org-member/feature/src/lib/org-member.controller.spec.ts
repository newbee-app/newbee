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
  testBaseGetOrgMemberPostsDto1,
  testBaseUpdateOrgMemberDto1,
  testDocQueryResult1,
  testOffsetAndLimit1,
  testOrgMemberRelation1,
  testQnaQueryResult1,
} from '@newbee/shared/util';
import { OrgMemberController } from './org-member.controller';

describe('OrgMemberController', () => {
  let controller: OrgMemberController;
  let service: OrgMemberService;
  let entityService: EntityService;

  const testUpdatedOrgMember = {
    ...testOrgMemberEntity1,
    role: testBaseUpdateOrgMemberDto1.role,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgMemberController],
      providers: [
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            updateRole: jest.fn().mockResolvedValue(testUpdatedOrgMember),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createOrgMemberNoOrg: jest
              .fn()
              .mockResolvedValue(testOrgMemberRelation1),
            createDocQueryResults: jest
              .fn()
              .mockResolvedValue([testDocQueryResult1]),
            createQnaQueryResults: jest
              .fn()
              .mockResolvedValue([testQnaQueryResult1]),
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
          testBaseUpdateOrgMemberDto1,
          testOrgMemberEntity1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual(testUpdatedOrgMember);
      expect(service.updateRole).toHaveBeenCalledTimes(1);
      expect(service.updateRole).toHaveBeenCalledWith(
        testOrgMemberEntity1,
        testBaseUpdateOrgMemberDto1.role,
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
          testBaseGetOrgMemberPostsDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testDocQueryResult1],
      });
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledWith(
        DocEntity,
        testOffsetAndLimit1,
        testOrganizationEntity1,
        { maintainer: testOrgMemberEntity1 },
      );
      expect(entityService.createDocQueryResults).toHaveBeenCalledTimes(1);
      expect(entityService.createDocQueryResults).toHaveBeenCalledWith([
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
          testBaseGetOrgMemberPostsDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testQnaQueryResult1],
      });
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledWith(
        QnaEntity,
        testOffsetAndLimit1,
        testOrganizationEntity1,
        { maintainer: testOrgMemberEntity1 },
      );
      expect(entityService.createQnaQueryResults).toHaveBeenCalledTimes(1);
      expect(entityService.createQnaQueryResults).toHaveBeenCalledWith([
        testQnaEntity1,
      ]);
    });
  });
});
