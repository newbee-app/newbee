import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseOrgMemberDto1,
  testBaseUpdateOrgMemberDto1,
} from '@newbee/shared/data-access';
import { OrgMemberController } from './org-member.controller';

describe('OrgMemberController', () => {
  let controller: OrgMemberController;
  let service: OrgMemberService;

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
            createOrgMemberDto: jest
              .fn()
              .mockResolvedValue(testBaseOrgMemberDto1),
            updateRole: jest.fn().mockResolvedValue(testUpdatedOrgMember),
          }),
        },
      ],
    }).compile();

    controller = module.get<OrgMemberController>(OrgMemberController);
    service = module.get<OrgMemberService>(OrgMemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return an org member as a DTO', async () => {
      await expect(
        controller.get(testOrgMemberEntity1, testOrganizationEntity1)
      ).resolves.toEqual(testBaseOrgMemberDto1);
      expect(service.createOrgMemberDto).toBeCalledTimes(1);
      expect(service.createOrgMemberDto).toBeCalledWith(testOrgMemberEntity1);
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
      ).resolves.toEqual(testBaseOrgMemberDto1);
      expect(service.updateRole).toBeCalledTimes(1);
      expect(service.updateRole).toBeCalledWith(
        testOrgMemberEntity1,
        testBaseUpdateOrgMemberDto1.role,
        testOrgMemberEntity1.role
      );
      expect(service.createOrgMemberDto).toBeCalledTimes(1);
      expect(service.createOrgMemberDto).toBeCalledWith(testUpdatedOrgMember);
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
