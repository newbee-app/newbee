import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DocService } from '@newbee/api/doc/data-access';
import {
  EntityService,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import {
  testBaseCreateDocDto1,
  testBaseUpdateDocDto1,
  testDocRelation1,
} from '@newbee/shared/util';
import { DocController } from './doc.controller';

describe('DocController', () => {
  let controller: DocController;
  let service: DocService;
  let entityService: EntityService;
  let teamMemberService: TeamMemberService;

  const testUpdatedDocEntity = { ...testDocEntity1, ...testBaseUpdateDocDto1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocController],
      providers: [
        {
          provide: DocService,
          useValue: createMock<DocService>({
            create: jest.fn().mockResolvedValue(testDocEntity1),
            update: jest.fn().mockResolvedValue(testUpdatedDocEntity),
            markUpToDate: jest.fn().mockResolvedValue(testUpdatedDocEntity),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createDocNoOrg: jest.fn().mockResolvedValue(testDocRelation1),
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

    controller = module.get<DocController>(DocController);
    service = module.get<DocService>(DocService);
    entityService = module.get<EntityService>(EntityService);
    teamMemberService = module.get<TeamMemberService>(TeamMemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
    expect(teamMemberService).toBeDefined();
  });

  it('create should create a doc', async () => {
    await expect(
      controller.create(
        testBaseCreateDocDto1,
        testOrgMemberEntity1,
        testOrganizationEntity1,
      ),
    ).resolves.toEqual(testDocEntity1);
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(
      testBaseCreateDocDto1,
      testOrgMemberEntity1,
    );
  });

  it('get should get a doc', async () => {
    await expect(
      controller.get(testDocEntity1, testOrgMemberEntity1),
    ).resolves.toEqual({
      doc: testDocRelation1,
      teamMember: testTeamMemberEntity1,
    });
    expect(entityService.createDocNoOrg).toBeCalledTimes(1);
    expect(entityService.createDocNoOrg).toBeCalledWith(testDocEntity1);
    expect(teamMemberService.findOneByOrgMemberAndTeamOrNull).toBeCalledTimes(
      1,
    );
    expect(teamMemberService.findOneByOrgMemberAndTeamOrNull).toBeCalledWith(
      testOrgMemberEntity1,
      testDocEntity1.team,
    );
  });

  it('update should update a doc', async () => {
    await expect(
      controller.update(
        testBaseUpdateDocDto1,
        testDocEntity1,
        testOrgMemberEntity1,
      ),
    ).resolves.toEqual(testUpdatedDocEntity);
    expect(service.update).toBeCalledTimes(1);
    expect(service.update).toBeCalledWith(
      testDocEntity1,
      testBaseUpdateDocDto1,
      testOrgMemberEntity1,
    );
  });

  it('markUpToDate should mark a doc as up-to-date', async () => {
    await expect(controller.markUpToDate(testDocEntity1)).resolves.toEqual(
      testUpdatedDocEntity,
    );
    expect(service.markUpToDate).toBeCalledTimes(1);
    expect(service.markUpToDate).toBeCalledWith(testDocEntity1);
  });

  it('delete should delete a doc', async () => {
    await expect(controller.delete(testDocEntity1)).resolves.toBeUndefined();
    expect(service.delete).toBeCalledTimes(1);
    expect(service.delete).toBeCalledWith(testDocEntity1);
  });
});
