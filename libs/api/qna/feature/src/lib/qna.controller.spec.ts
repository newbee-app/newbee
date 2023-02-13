import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testQnaEntity1,
  testTeamEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import {
  testBaseCreateQnaDto1,
  testBaseTeamSlugDto1,
  testBaseUpdateQnaDto1,
} from '@newbee/shared/data-access';
import { QnaController } from './qna.controller';

describe('QnaController', () => {
  let controller: QnaController;
  let service: QnaService;
  let organizationService: OrganizationService;
  let orgMemberService: OrgMemberService;
  let teamService: TeamService;

  const testUpdatedQnaEntity = { ...testQnaEntity1, ...testBaseUpdateQnaDto1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QnaController],
      providers: [
        {
          provide: QnaService,
          useValue: createMock<QnaService>({
            create: jest.fn().mockResolvedValue(testQnaEntity1),
            findOneBySlug: jest.fn().mockResolvedValue(testQnaEntity1),
            update: jest.fn().mockResolvedValue(testUpdatedQnaEntity),
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
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            findOneBySlug: jest.fn().mockResolvedValue(testTeamEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<QnaController>(QnaController);
    service = module.get<QnaService>(QnaService);
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

  it('create should create a qna', async () => {
    await expect(
      controller.create(
        testBaseCreateQnaDto1,
        testUserEntity1,
        testOrganizationEntity1.name,
        testBaseTeamSlugDto1
      )
    ).resolves.toEqual(testQnaEntity1);
    expect(organizationService.findOneBySlug).toBeCalledTimes(1);
    expect(organizationService.findOneBySlug).toBeCalledWith(
      testOrganizationEntity1.name
    );
    expect(orgMemberService.findOneByUserAndOrg).toBeCalledTimes(1);
    expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
      testUserEntity1,
      testOrganizationEntity1
    );
    expect(teamService.findOneBySlug).toBeCalledTimes(1);
    expect(teamService.findOneBySlug).toBeCalledWith(
      testOrganizationEntity1,
      testTeamEntity1.slug
    );
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(
      testBaseCreateQnaDto1,
      testTeamEntity1,
      testOrgMemberEntity1
    );
  });

  describe('finds qna', () => {
    afterEach(() => {
      expect(service.findOneBySlug).toBeCalledTimes(1);
      expect(service.findOneBySlug).toBeCalledWith(testQnaEntity1.slug);
    });

    it('get should get a qna', async () => {
      await expect(controller.get(testQnaEntity1.slug)).resolves.toEqual(
        testQnaEntity1
      );
    });

    it('update should update a qna', async () => {
      await expect(
        controller.update(testQnaEntity1.slug, testBaseUpdateQnaDto1)
      ).resolves.toEqual(testUpdatedQnaEntity);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testQnaEntity1,
        testBaseUpdateQnaDto1
      );
    });

    it('delete should delete a qna', async () => {
      await expect(
        controller.delete(testQnaEntity1.slug)
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testQnaEntity1);
    });
  });
});
