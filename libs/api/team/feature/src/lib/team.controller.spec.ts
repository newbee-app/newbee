import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  testOrganizationEntity1,
  testTeamEntity1,
  testUserEntity1,
  testUserOrganizationEntity1,
} from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import { UserOrganizationService } from '@newbee/api/user-organization/data-access';
import {
  testBaseCreateTeamDto1,
  testBaseUpdateTeamDto1,
} from '@newbee/shared/data-access';
import { TeamController } from './team.controller';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;
  let organizationService: OrganizationService;
  let userOrganizationService: UserOrganizationService;

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
            findOneByName: jest.fn().mockResolvedValue(testTeamEntity1),
            update: jest.fn().mockResolvedValue(testUpdatedTeamEntity),
          }),
        },
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            findOneByName: jest.fn().mockResolvedValue(testOrganizationEntity1),
          }),
        },
        {
          provide: UserOrganizationService,
          useValue: createMock<UserOrganizationService>({
            findOneByUserAndOrganization: jest
              .fn()
              .mockResolvedValue(testUserOrganizationEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
    organizationService = module.get<OrganizationService>(OrganizationService);
    userOrganizationService = module.get<UserOrganizationService>(
      UserOrganizationService
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(userOrganizationService).toBeDefined();
  });

  describe('finds organization', () => {
    afterEach(() => {
      expect(organizationService.findOneByName).toBeCalledTimes(1);
      expect(organizationService.findOneByName).toBeCalledWith(
        testOrganizationEntity1.name
      );
    });

    it('create should create a team', async () => {
      await expect(
        controller.create(
          testBaseCreateTeamDto1,
          testUserEntity1,
          testOrganizationEntity1.name
        )
      ).resolves.toEqual(testTeamEntity1);
      expect(organizationService.findOneByName).toBeCalledTimes(1);
      expect(organizationService.findOneByName).toBeCalledWith(
        testOrganizationEntity1.name
      );
      expect(
        userOrganizationService.findOneByUserAndOrganization
      ).toBeCalledTimes(1);
      expect(
        userOrganizationService.findOneByUserAndOrganization
      ).toBeCalledWith(testUserEntity1, testOrganizationEntity1);
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testBaseCreateTeamDto1,
        testUserOrganizationEntity1
      );
    });

    describe('finds team', () => {
      afterEach(() => {
        expect(service.findOneByName).toBeCalledTimes(1);
        expect(service.findOneByName).toBeCalledWith(
          testOrganizationEntity1,
          testTeamEntity1.name
        );
      });

      it('get should find and return a team', async () => {
        await expect(
          controller.get(testOrganizationEntity1.name, testTeamEntity1.name)
        ).resolves.toEqual(testTeamEntity1);
      });

      it('udpate should find and update a team', async () => {
        await expect(
          controller.update(
            testOrganizationEntity1.name,
            testTeamEntity1.name,
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
          controller.delete(testOrganizationEntity1.name, testTeamEntity1.name)
        ).resolves.toBeUndefined();
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(testTeamEntity1);
      });
    });
  });
});