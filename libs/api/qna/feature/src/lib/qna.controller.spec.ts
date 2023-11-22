import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  EntityService,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
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
          provide: EntityService,
          useValue: createMock<EntityService>({
            createQnaNoOrg: jest.fn().mockResolvedValue(testQnaRelation1),
          }),
        },
      ],
    }).compile();

    controller = module.get<QnaController>(QnaController);
    service = module.get<QnaService>(QnaService);
    entityService = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
  });

  it('create should create a qna', async () => {
    await expect(
      controller.create(
        testBaseCreateQnaDto1,
        testOrgMemberEntity1,
        testOrganizationEntity1,
        testTeamEntity1,
      ),
    ).resolves.toEqual(testQnaEntity1);
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(
      testBaseCreateQnaDto1,
      testTeamEntity1,
      testOrgMemberEntity1,
    );
  });

  it('get should get a qna', async () => {
    await expect(
      controller.get(testQnaEntity1, testTeamMemberEntity1),
    ).resolves.toEqual({
      qna: testQnaRelation1,
      teamMember: testTeamMemberEntity1,
    });
    expect(entityService.createQnaNoOrg).toBeCalledTimes(1);
    expect(entityService.createQnaNoOrg).toBeCalledWith(testQnaEntity1);
  });

  it('updateQuestion should update the question', async () => {
    await expect(
      controller.updateQuestion(testBaseUpdateQuestionDto1, testQnaEntity1),
    ).resolves.toEqual(testUpdatedQnaEntity);
    expect(service.update).toBeCalledTimes(1);
    expect(service.update).toBeCalledWith(
      testQnaEntity1,
      testBaseUpdateQuestionDto1,
    );
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
    expect(service.update).toBeCalledTimes(1);
    expect(service.update).toBeCalledWith(
      testQnaEntity2,
      testBaseUpdateAnswerDto1,
      testOrgMemberEntity1,
    );
  });

  it('markUpToDate should mark a qna as up-to-date', async () => {
    await expect(controller.markUpToDate(testQnaEntity1)).resolves.toEqual(
      testUpdatedQnaEntity,
    );
    expect(service.markUpToDate).toBeCalledTimes(1);
    expect(service.markUpToDate).toBeCalledWith(testQnaEntity1);
  });

  it('delete should delete a qna', async () => {
    await expect(controller.delete(testQnaEntity1)).resolves.toBeUndefined();
    expect(service.delete).toBeCalledTimes(1);
    expect(service.delete).toBeCalledWith(testQnaEntity1);
  });
});
