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
  let organizationService: OrganizationService;
  let orgMemberService: OrgMemberService;

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
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            findOneBySlug: jest.fn().mockResolvedValue(testOrganizationEntity1),
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
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
    organizationService = module.get<OrganizationService>(OrganizationService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('finds organization', () => {
    afterEach(() => {
      expect(organizationService.findOneBySlug).toBeCalledTimes(1);
      expect(organizationService.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1.slug
      );
    });

    it('create should create a team', async () => {
      await expect(
        controller.create(
          testBaseCreateTeamDto1,
          testUserEntity1,
          testOrganizationEntity1.slug
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
          controller.get(testOrganizationEntity1.slug, testTeamEntity1.slug)
        ).resolves.toEqual(testTeamEntity1);
      });

      it('udpate should find and update a team', async () => {
        await expect(
          controller.update(
            testOrganizationEntity1.slug,
            testTeamEntity1.slug,
            testBaseUpdateTeamDto1
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
          controller.delete(testOrganizationEntity1.slug, testTeamEntity1.slug)
        ).resolves.toBeUndefined();
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(testTeamEntity1);
      });
    });
  });
});
