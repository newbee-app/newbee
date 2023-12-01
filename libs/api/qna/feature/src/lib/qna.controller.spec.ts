import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  EntityService,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import {
  testBaseCreateQnaDto1,
  testBaseUpdateAnswerDto1,
  testBaseUpdateQnaDto1,
  testBaseUpdateQuestionDto1,
  testQnaRelation1,
} from '@newbee/shared/util';
import { QnaController } from './qna.controller';

describe('QnaController', () => {
  let controller: QnaController;
  let service: QnaService;
  let entityService: EntityService;
  let teamMemberService: TeamMemberService;

  const { team: _team, ...restUpdateQnaDto } = testBaseUpdateQnaDto1;
  _team;
  const testUpdatedQnaEntity = { ...testQnaEntity1, ...restUpdateQnaDto };

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
          provide: EntityService,
          useValue: createMock<EntityService>({
            createQnaNoOrg: jest.fn().mockResolvedValue(testQnaRelation1),
          }),
        },
        {
          provide: TeamMemberService,
          useValue: createMock<TeamMemberService>({
            findOneByOrgMemberAndTeamOrNull: jest
              .fn()
              .mockResolvedValue(testTeamMemberEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<QnaController>(QnaController);
    service = module.get<QnaService>(QnaService);
    entityService = module.get<EntityService>(EntityService);
    teamMemberService = module.get<TeamMemberService>(TeamMemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
    expect(teamMemberService).toBeDefined();
  });

  it('create should create a qna', async () => {
    await expect(
      controller.create(
        testBaseCreateQnaDto1,
        testOrgMemberEntity1,
        testOrganizationEntity1,
      ),
    ).resolves.toEqual(testQnaEntity1);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(service.create).toHaveBeenCalledWith(
      testBaseCreateQnaDto1,
      testOrgMemberEntity1,
    );
  });

  describe('get & updateQuestion', () => {
    const qnaAndMemberDto = {
      qna: testQnaRelation1,
      teamMember: testTeamMemberEntity1,
    };

    afterEach(() => {
      expect(entityService.createQnaNoOrg).toHaveBeenCalledTimes(1);
      expect(
        teamMemberService.findOneByOrgMemberAndTeamOrNull,
      ).toHaveBeenCalledTimes(1);
      expect(
        teamMemberService.findOneByOrgMemberAndTeamOrNull,
      ).toHaveBeenCalledWith(testOrgMemberEntity1, testQnaEntity1.team);
    });

    it('get should get a qna', async () => {
      await expect(
        controller.get(testQnaEntity1, testOrgMemberEntity1),
      ).resolves.toEqual(qnaAndMemberDto);
      expect(entityService.createQnaNoOrg).toHaveBeenCalledWith(testQnaEntity1);
    });

    it('updateQuestion should update the question', async () => {
      await expect(
        controller.updateQuestion(
          testBaseUpdateQuestionDto1,
          testQnaEntity1,
          testOrgMemberEntity1,
        ),
      ).resolves.toEqual(qnaAndMemberDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        testQnaEntity1,
        testBaseUpdateQuestionDto1,
        testOrgMemberEntity1,
      );
      expect(entityService.createQnaNoOrg).toHaveBeenCalledWith(
        testUpdatedQnaEntity,
      );
    });
  });

  it('updateAnswer should update the answer', async () => {
    const testQnaEntity2 = {
      ...testQnaEntity1,
      maintainer: null,
      trueUpToDateDuration: testQnaEntity1.trueUpToDateDuration,
    };
    jest.spyOn(service, 'findOneBySlug').mockResolvedValue(testQnaEntity2);
    await expect(
      controller.updateAnswer(
        testBaseUpdateAnswerDto1,
        testQnaEntity2,
        testOrgMemberEntity1,
      ),
    ).resolves.toEqual(testUpdatedQnaEntity);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(
      testQnaEntity2,
      testBaseUpdateAnswerDto1,
      testOrgMemberEntity1,
      true,
    );
  });

  it('markUpToDate should mark a qna as up-to-date', async () => {
    await expect(controller.markUpToDate(testQnaEntity1)).resolves.toEqual(
      testUpdatedQnaEntity,
    );
    expect(service.markUpToDate).toHaveBeenCalledTimes(1);
    expect(service.markUpToDate).toHaveBeenCalledWith(testQnaEntity1);
  });

  it('delete should delete a qna', async () => {
    await expect(controller.delete(testQnaEntity1)).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledTimes(1);
    expect(service.delete).toHaveBeenCalledWith(testQnaEntity1);
  });
});
