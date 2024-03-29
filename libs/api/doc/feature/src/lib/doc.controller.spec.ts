import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DocService } from '@newbee/api/doc/data-access';
import {
  DocEntity,
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
  testDocQueryResult1,
  testDocRelation1,
  testOffsetAndLimit1,
} from '@newbee/shared/util';
import { DocController } from './doc.controller';

describe('DocController', () => {
  let controller: DocController;
  let service: DocService;
  let entityService: EntityService;
  let teamMemberService: TeamMemberService;

  const { team: _team, ...restUpdateDocDto } = testBaseUpdateDocDto1;
  _team;
  const testUpdatedDocEntity = { ...testDocEntity1, ...restUpdateDocDto };

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
            createDocQueryResults: jest
              .fn()
              .mockResolvedValue([testDocQueryResult1]),
            findPostsByOrgAndCount: jest
              .fn()
              .mockResolvedValue([[testDocEntity1], 1]),
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

  describe('getAll', () => {
    it('should get doc results', async () => {
      await expect(
        controller.getAll(testOffsetAndLimit1, testOrganizationEntity1),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testDocQueryResult1],
      });
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledWith(
        DocEntity,
        testOffsetAndLimit1,
        testOrganizationEntity1,
      );
      expect(entityService.createDocQueryResults).toHaveBeenCalledTimes(1);
      expect(entityService.createDocQueryResults).toHaveBeenCalledWith([
        testDocEntity1,
      ]);
    });
  });

  describe('create', () => {
    it('should create a doc', async () => {
      await expect(
        controller.create(
          testBaseCreateDocDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual(testDocEntity1);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        testBaseCreateDocDto1,
        testOrgMemberEntity1,
      );
    });
  });

  describe('get & update', () => {
    const docAndMemberDto = {
      doc: testDocRelation1,
      teamMember: testTeamMemberEntity1,
    };

    afterEach(() => {
      expect(entityService.createDocNoOrg).toHaveBeenCalledTimes(1);
      expect(
        teamMemberService.findOneByOrgMemberAndTeamOrNull,
      ).toHaveBeenCalledTimes(1);
      expect(
        teamMemberService.findOneByOrgMemberAndTeamOrNull,
      ).toHaveBeenCalledWith(testOrgMemberEntity1, testDocEntity1.team);
    });

    it('get should get a doc', async () => {
      await expect(
        controller.get(testDocEntity1, testOrgMemberEntity1),
      ).resolves.toEqual(docAndMemberDto);
      expect(entityService.createDocNoOrg).toHaveBeenCalledWith(testDocEntity1);
    });

    it('update should update a doc', async () => {
      await expect(
        controller.update(
          testBaseUpdateDocDto1,
          testDocEntity1,
          testOrgMemberEntity1,
        ),
      ).resolves.toEqual(docAndMemberDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        testDocEntity1,
        testBaseUpdateDocDto1,
      );
      expect(entityService.createDocNoOrg).toHaveBeenCalledWith(
        testUpdatedDocEntity,
      );
    });
  });

  describe('markUpToDate', () => {
    it('should mark a doc as up-to-date', async () => {
      await expect(controller.markUpToDate(testDocEntity1)).resolves.toEqual(
        testUpdatedDocEntity,
      );
      expect(service.markUpToDate).toHaveBeenCalledTimes(1);
      expect(service.markUpToDate).toHaveBeenCalledWith(testDocEntity1);
    });
  });

  describe('delete', () => {
    it('should delete a doc', async () => {
      await expect(controller.delete(testDocEntity1)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(testDocEntity1);
    });
  });
});
