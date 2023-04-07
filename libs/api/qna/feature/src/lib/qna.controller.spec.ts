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
  testBaseUpdateAnswerDto1,
  testBaseUpdateQnaDto1,
  testBaseUpdateQuestionDto1,
} from '@newbee/shared/data-access';
import { QnaController } from './qna.controller';

describe('QnaController', () => {
  let controller: QnaController;
  let service: QnaService;
  let orgMemberService: OrgMemberService;
  let teamService: TeamService;
  let organizationService: OrganizationService;

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
            markUpToDate: jest.fn().mockResolvedValue(testUpdatedQnaEntity),
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
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>(),
        },
      ],
    }).compile();

    controller = module.get<QnaController>(QnaController);
    service = module.get<QnaService>(QnaService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
    teamService = module.get<TeamService>(TeamService);
    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(teamService).toBeDefined();
    expect(organizationService).toBeDefined();
  });

  it('create should create a qna', async () => {
    await expect(
      controller.create(
        testBaseCreateQnaDto1,
        testUserEntity1,
        testOrganizationEntity1,
        testBaseTeamSlugDto1
      )
    ).resolves.toEqual(testQnaEntity1);
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

    it('updateQuestion should update the question', async () => {
      await expect(
        controller.updateQuestion(
          testQnaEntity1.slug,
          testBaseUpdateQuestionDto1
        )
      ).resolves.toEqual(testUpdatedQnaEntity);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testQnaEntity1,
        testBaseUpdateQuestionDto1
      );
    });

    it('updateAnswer should update the answer', async () => {
      const testQnaEntity2 = { ...testQnaEntity1, maintainer: null };
      jest.spyOn(service, 'findOneBySlug').mockResolvedValue(testQnaEntity2);
      await expect(
        controller.updateAnswer(
          testQnaEntity2.slug,
          testUserEntity1,
          testOrganizationEntity1,
          testBaseUpdateAnswerDto1
        )
      ).resolves.toEqual(testUpdatedQnaEntity);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testQnaEntity2,
        testBaseUpdateAnswerDto1,
        testOrgMemberEntity1
      );
    });

    it('markUpToDate should mark a qna as up-to-date', async () => {
      await expect(
        controller.markUpToDate(testQnaEntity1.slug)
      ).resolves.toEqual(testUpdatedQnaEntity);
      expect(service.markUpToDate).toBeCalledTimes(1);
      expect(service.markUpToDate).toBeCalledWith(testQnaEntity1);
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
