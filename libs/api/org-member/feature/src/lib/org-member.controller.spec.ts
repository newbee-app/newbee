import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
} from '@newbee/api/shared/data-access';
import { testBaseOrgMemberDto1 } from '@newbee/shared/data-access';
import { OrgMemberController } from './org-member.controller';

describe('OrgMemberController', () => {
  let controller: OrgMemberController;
  let service: OrgMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgMemberController],
      providers: [
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            findOneByOrgAndSlug: jest
              .fn()
              .mockResolvedValue(testOrgMemberEntity1),
            createOrgMemberDto: jest
              .fn()
              .mockResolvedValue(testBaseOrgMemberDto1),
          }),
        },
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>(),
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
        controller.get(testOrganizationEntity1, testOrgMemberEntity1.slug)
      ).resolves.toEqual(testBaseOrgMemberDto1);
      expect(service.findOneByOrgAndSlug).toBeCalledTimes(1);
      expect(service.findOneByOrgAndSlug).toBeCalledWith(
        testOrganizationEntity1,
        testOrgMemberEntity1.slug
      );
      expect(service.createOrgMemberDto).toBeCalledTimes(1);
      expect(service.createOrgMemberDto).toBeCalledWith(testOrgMemberEntity1);
    });
  });
});
