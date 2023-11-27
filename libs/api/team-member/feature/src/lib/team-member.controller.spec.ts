import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import {
  testBaseCreateTeamMemberDto1,
  testBaseUpdateTeamMemberDto1,
} from '@newbee/shared/util';
import { TeamMemberController } from './team-member.controller';

describe('TeamMemberController', () => {
  let controller: TeamMemberController;
  let service: TeamMemberService;
  let orgMemberService: OrgMemberService;

  const testUpdatedTeamMember = {
    ...testTeamMemberEntity1,
    role: testBaseUpdateTeamMemberDto1.role,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamMemberController],
      providers: [
        {
          provide: TeamMemberService,
          useValue: createMock<TeamMemberService>({
            create: jest.fn().mockResolvedValue(testTeamMemberEntity1),
            updateRole: jest.fn().mockResolvedValue(testUpdatedTeamMember),
          }),
        },
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            findOneByOrgAndSlug: jest
              .fn()
              .mockResolvedValue(testOrgMemberEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<TeamMemberController>(TeamMemberController);
    service = module.get<TeamMemberService>(TeamMemberService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('create', () => {
    it('should create a team member', async () => {
      await expect(
        controller.create(
          testBaseCreateTeamMemberDto1,
          testOrgMemberEntity1,
          testTeamMemberEntity1,
          testOrganizationEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual(testTeamMemberEntity1);
      expect(orgMemberService.findOneByOrgAndSlug).toBeCalledTimes(1);
      expect(orgMemberService.findOneByOrgAndSlug).toBeCalledWith(
        testOrganizationEntity1,
        testBaseCreateTeamMemberDto1.orgMemberSlug,
      );
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testOrgMemberEntity1,
        testTeamEntity1,
        testBaseCreateTeamMemberDto1.role,
        testOrgMemberEntity1.role,
        testTeamMemberEntity1.role,
      );
    });
  });

  describe('update', () => {
    it('should update a team member', async () => {
      await expect(
        controller.update(
          testBaseUpdateTeamMemberDto1,
          testOrgMemberEntity1,
          testTeamMemberEntity1,
          testOrgMemberEntity1,
          testTeamMemberEntity1,
          testOrganizationEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual(testUpdatedTeamMember);
      expect(service.updateRole).toBeCalledTimes(1);
      expect(service.updateRole).toBeCalledWith(
        testTeamMemberEntity1,
        testBaseUpdateTeamMemberDto1.role,
        testOrgMemberEntity1.role,
        testTeamMemberEntity1.role,
      );
    });
  });

  describe('delete', () => {
    it('should delete a team member', async () => {
      await expect(
        controller.delete(
          testOrgMemberEntity1,
          testOrgMemberEntity1,
          testTeamMemberEntity1,
          testOrganizationEntity1,
          testTeamEntity1,
        ),
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testTeamMemberEntity1);
    });
  });
});
