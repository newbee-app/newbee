import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  testDocEntity1,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import {
  testBaseCreateDocDto1,
  testBaseTeamNameDto1,
  testBaseUpdateDocDto1,
} from '@newbee/shared/data-access';
import { DocController } from './doc.controller';

describe('DocController', () => {
  let controller: DocController;
  let service: DocService;
  let organizationService: OrganizationService;
  let orgMemberService: OrgMemberService;
  let teamService: TeamService;

  const testUpdatedDocEntity = { ...testDocEntity1, ...testBaseUpdateDocDto1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocController],
      providers: [
        {
          provide: DocService,
          useValue: createMock<DocService>({
            create: jest.fn().mockResolvedValue(testDocEntity1),
            findOneBySlug: jest.fn().mockResolvedValue(testDocEntity1),
            update: jest.fn().mockResolvedValue(testUpdatedDocEntity),
          }),
        },
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            findOneByName: jest.fn().mockResolvedValue(testOrganizationEntity1),
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
          provide: TeamService,
          useValue: createMock<TeamService>({
            findOneByName: jest.fn().mockResolvedValue(testTeamEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<DocController>(DocController);
    service = module.get<DocService>(DocService);
    organizationService = module.get<OrganizationService>(OrganizationService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(teamService).toBeDefined();
  });

  describe('finds organization', () => {
    afterEach(() => {
      expect(organizationService.findOneByName).toBeCalledTimes(1);
      expect(organizationService.findOneByName).toBeCalledWith(
        testOrganizationEntity1.name
      );
    });
    it('create should create a doc', async () => {
      await expect(
        controller.create(
          testBaseCreateDocDto1,
          testUserEntity1,
          testOrganizationEntity1.name,
          testBaseTeamNameDto1
        )
      ).resolves.toEqual(testDocEntity1);
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledTimes(1);
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
        testUserEntity1,
        testOrganizationEntity1
      );
      expect(teamService.findOneByName).toBeCalledTimes(1);
      expect(teamService.findOneByName).toBeCalledWith(
        testOrganizationEntity1,
        testTeamEntity1.name
      );
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testBaseCreateDocDto1,
        testTeamEntity1,
        testOrgMemberEntity1
      );
    });

    describe('finds doc', () => {
      afterEach(() => {
        expect(service.findOneBySlug).toBeCalledTimes(1);
        expect(service.findOneBySlug).toBeCalledWith(
          testOrganizationEntity1,
          testDocEntity1.slug
        );
      });

      it('get should get a doc', async () => {
        await expect(
          controller.get(testOrganizationEntity1.name, testDocEntity1.slug)
        ).resolves.toEqual(testDocEntity1);
      });

      it('update should update a doc', async () => {
        await expect(
          controller.update(
            testOrganizationEntity1.name,
            testDocEntity1.slug,
            testBaseUpdateDocDto1
          )
        ).resolves.toEqual(testUpdatedDocEntity);
        expect(service.update).toBeCalledTimes(1);
        expect(service.update).toBeCalledWith(
          testDocEntity1,
          testBaseUpdateDocDto1
        );
      });

      it('delete should delete a doc', async () => {
        await expect(
          controller.delete(testOrganizationEntity1.name, testDocEntity1.slug)
        ).resolves.toBeUndefined();
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(testDocEntity1);
      });
    });
  });
});
