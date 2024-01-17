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
  testOffsetAndLimit1,
  testQnaQueryResult1,
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
            update: jest.fn().mockResolvedValue(testUpdatedQnaEntity),
            markUpToDate: jest.fn().mockResolvedValue(testUpdatedQnaEntity),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createQnaNoOrg: jest.fn().mockResolvedValue(testQnaRelation1),
            createQnaQueryResults: jest
              .fn()
              .mockResolvedValue([testQnaQueryResult1]),
            findQnasByOrgAndCount: jest
              .fn()
              .mockResolvedValue([[testQnaEntity1], 1]),
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

  describe('getAll', () => {
    it('should get qna results', async () => {
      await expect(
        controller.getAll(testOffsetAndLimit1, testOrganizationEntity1),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testQnaQueryResult1],
      });
      expect(entityService.findQnasByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findQnasByOrgAndCount).toHaveBeenCalledWith(
        testOffsetAndLimit1,
        testOrganizationEntity1,
      );
      expect(entityService.createQnaQueryResults).toHaveBeenCalledTimes(1);
      expect(entityService.createQnaQueryResults).toHaveBeenCalledWith([
        testQnaEntity1,
      ]);
    });
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
      );
      expect(entityService.createQnaNoOrg).toHaveBeenCalledWith(
        testUpdatedQnaEntity,
      );
    });
  });

  it('updateAnswer should update the answer', async () => {
    await expect(
      controller.updateAnswer(testBaseUpdateAnswerDto1, testQnaEntity1),
    ).resolves.toEqual(testUpdatedQnaEntity);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(
      testQnaEntity1,
      testBaseUpdateAnswerDto1,
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
