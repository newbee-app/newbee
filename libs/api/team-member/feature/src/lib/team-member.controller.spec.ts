import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  EntityService,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import {
  testBaseCreateTeamMemberDto1,
  testBaseUpdateTeamMemberDto1,
  testTeamMemberRelation1,
} from '@newbee/shared/util';
import { TeamMemberController } from './team-member.controller';

describe('TeamMemberController', () => {
  let controller: TeamMemberController;
  let service: TeamMemberService;
  let orgMemberService: OrgMemberService;
  let entityService: EntityService;

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
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createTeamMemberUserOrgMember: jest
              .fn()
              .mockResolvedValue(testTeamMemberRelation1),
          }),
        },
      ],
    }).compile();

    controller = module.get<TeamMemberController>(TeamMemberController);
    service = module.get<TeamMemberService>(TeamMemberService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
    entityService = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(entityService).toBeDefined();
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
      ).resolves.toEqual(testTeamMemberRelation1);
      expect(orgMemberService.findOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(orgMemberService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testBaseCreateTeamMemberDto1.orgMemberSlug,
      );
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        testOrgMemberEntity1,
        testTeamEntity1,
        testBaseCreateTeamMemberDto1.role,
        testOrgMemberEntity1.role,
        testTeamMemberEntity1.role,
      );
      expect(entityService.createTeamMemberUserOrgMember).toHaveBeenCalledTimes(
        1,
      );
      expect(entityService.createTeamMemberUserOrgMember).toHaveBeenCalledWith(
        testTeamMemberEntity1,
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
      expect(service.updateRole).toHaveBeenCalledTimes(1);
      expect(service.updateRole).toHaveBeenCalledWith(
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
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(testTeamMemberEntity1);
    });
  });
});
