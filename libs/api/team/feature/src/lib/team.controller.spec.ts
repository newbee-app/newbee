import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import {
  testBaseCreateTeamDto1,
  testBaseUpdateTeamDto1,
} from '@newbee/shared/data-access';
import { TeamController } from './team.controller';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;
  let orgMemberService: OrgMemberService;
  let organizationService: OrganizationService;

  const testUpdatedTeamEntity = {
    ...testTeamEntity1,
    ...testBaseUpdateTeamDto1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            create: jest.fn().mockResolvedValue(testTeamEntity1),
            findOneBySlug: jest.fn().mockResolvedValue(testTeamEntity1),
            update: jest.fn().mockResolvedValue(testUpdatedTeamEntity),
          }),
        },
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            findOneByUserAndOrg: jest
              .fn()
              .mockResolvedValue(testOrgMemberEntity1),
          }),
        },
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>(),
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(organizationService).toBeDefined();
  });

  it('create should create a team', async () => {
    await expect(
      controller.create(
        testBaseCreateTeamDto1,
        testUserEntity1,
        testOrganizationEntity1
      )
    ).resolves.toEqual(testTeamEntity1);
    expect(orgMemberService.findOneByUserAndOrg).toBeCalledTimes(1);
    expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
      testUserEntity1,
      testOrganizationEntity1
    );
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(
      testBaseCreateTeamDto1,
      testOrgMemberEntity1
    );
  });

  describe('finds team', () => {
    afterEach(() => {
      expect(service.findOneBySlug).toBeCalledTimes(1);
      expect(service.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        testTeamEntity1.slug
      );
    });

    it('get should find and return a team', async () => {
      await expect(
        controller.get(testTeamEntity1.slug, testOrganizationEntity1)
      ).resolves.toEqual(testTeamEntity1);
    });

    it('udpate should find and update a team', async () => {
      await expect(
        controller.update(
          testTeamEntity1.slug,
          testBaseUpdateTeamDto1,
          testOrganizationEntity1
        )
      ).resolves.toEqual(testUpdatedTeamEntity);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testTeamEntity1,
        testBaseUpdateTeamDto1
      );
    });

    it('should delete the team', async () => {
      await expect(
        controller.delete(testTeamEntity1.slug, testOrganizationEntity1)
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testTeamEntity1);
    });
  });
});
