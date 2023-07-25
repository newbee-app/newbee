import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  EntityService,
  testOrganizationEntity1,
  testOrgMemberEntity1,
} from '@newbee/api/shared/data-access';
import { testBaseUpdateOrgMemberDto1 } from '@newbee/shared/data-access';
import { testOrgMemberRelation1 } from '@newbee/shared/util';
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
        controller.getBySlug(testOrgMemberEntity1, testOrganizationEntity1)
      ).resolves.toEqual(testOrgMemberRelation1);
      expect(entityService.createOrgMemberNoOrg).toBeCalledTimes(1);
      expect(entityService.createOrgMemberNoOrg).toBeCalledWith(
        testOrgMemberEntity1
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
          testOrganizationEntity1
        )
      ).resolves.toEqual(testUpdatedOrgMember);
      expect(service.updateRole).toBeCalledTimes(1);
      expect(service.updateRole).toBeCalledWith(
        testOrgMemberEntity1,
        testBaseUpdateOrgMemberDto1.role,
        testOrgMemberEntity1.role
      );
    });
  });

  describe('delete', () => {
    it('should delete an org member', async () => {
      await expect(
        controller.delete(
          testOrgMemberEntity1,
          testOrgMemberEntity1,
          testOrganizationEntity1
        )
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(
        testOrgMemberEntity1,
        testOrgMemberEntity1.role
      );
    });
  });
});
