import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DocEntity,
  EntityService,
  QnaEntity,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import {
  testCreateTeamDto1,
  testDocSearchResult1,
  testGenerateSlugDto1,
  testGeneratedSlugDto1,
  testOffsetAndLimit1,
  testQnaSearchResult1,
  testSlugDto1,
  testSlugTakenDto1,
  testTeamRelation1,
  testUpdateTeamDto1,
} from '@newbee/shared/util';
import slug from 'slug';
import { TeamController } from './team.controller';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;
  let entityService: EntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            create: jest.fn().mockResolvedValue(testTeamEntity1),
            update: jest.fn().mockResolvedValue(testTeamEntity1),
            hasOneByOrgAndSlug: jest.fn().mockResolvedValue(true),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createTeamNoOrg: jest.fn().mockResolvedValue(testTeamRelation1),
            createDocSearchResults: jest
              .fn()
              .mockResolvedValue([testDocSearchResult1]),
            createQnaSearchResults: jest
              .fn()
              .mockResolvedValue([testQnaSearchResult1]),
          }),
        },
      ],
    }).compile();

    controller = module.get(TeamController);
    service = module.get(TeamService);
    entityService = module.get(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('create', () => {
    it('should create a team', async () => {
      await expect(
        controller.create(
          testCreateTeamDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual(testTeamEntity1);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        testCreateTeamDto1,
        testOrgMemberEntity1,
      );
    });
  });

  describe('checkSlug', () => {
    it('should return true if slug is taken, false if not', async () => {
      await expect(
        controller.checkSlug(
          testSlugDto1,
          testOrganizationEntity1,
          testUserEntity1,
        ),
      ).resolves.toEqual(testSlugTakenDto1);
      expect(service.hasOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(service.hasOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testSlugDto1.slug,
      );

      jest.spyOn(service, 'hasOneByOrgAndSlug').mockResolvedValue(false);
      await expect(
        controller.checkSlug(
          testSlugDto1,
          testOrganizationEntity1,
          testUserEntity1,
        ),
      ).resolves.toEqual({ slugTaken: false });
      expect(service.hasOneByOrgAndSlug).toHaveBeenCalledTimes(2);
      expect(service.hasOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testSlugDto1.slug,
      );
    });
  });

  describe('generateSlug', () => {
    it('should generate a unique slug', async () => {
      jest.spyOn(service, 'hasOneByOrgAndSlug').mockResolvedValue(false);
      const sluggedBase = slug(testGenerateSlugDto1.base);
      await expect(
        controller.generateSlug(
          testGenerateSlugDto1,
          testOrganizationEntity1,
          testUserEntity1,
        ),
      ).resolves.toEqual(testGeneratedSlugDto1);
      expect(service.hasOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(service.hasOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        sluggedBase,
      );
    });
  });

  describe('get', () => {
    it('should find and return a team and teamMember', async () => {
      await expect(
        controller.get(
          testOrganizationEntity1,
          testTeamEntity1,
          testTeamMemberEntity1,
        ),
      ).resolves.toEqual({
        team: testTeamRelation1,
        teamMember: testTeamMemberEntity1,
      });
      expect(entityService.createTeamNoOrg).toHaveBeenCalledTimes(1);
      expect(entityService.createTeamNoOrg).toHaveBeenCalledWith(
        testTeamEntity1,
      );
    });

    it('should return null for teamMember if user is not a teamMember', async () => {
      await expect(
        controller.get(testOrganizationEntity1, testTeamEntity1, undefined),
      ).resolves.toEqual({ team: testTeamRelation1, teamMember: null });
      expect(entityService.createTeamNoOrg).toHaveBeenCalledTimes(1);
      expect(entityService.createTeamNoOrg).toHaveBeenCalledWith(
        testTeamEntity1,
      );
    });
  });

  it('udpate should find and update a team', async () => {
    await expect(
      controller.update(
        testUpdateTeamDto1,
        testOrganizationEntity1,
        testTeamEntity1,
      ),
    ).resolves.toEqual(testTeamEntity1);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(
      testTeamEntity1,
      testUpdateTeamDto1,
    );
  });

  it('should delete the team', async () => {
    await expect(
      controller.delete(testOrganizationEntity1, testTeamEntity1),
    ).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledTimes(1);
    expect(service.delete).toHaveBeenCalledWith(testTeamEntity1);
  });

  describe('getAllDocs', () => {
    it('should get doc results', async () => {
      jest
        .spyOn(entityService, 'findPostsByOrgAndCount')
        .mockResolvedValue([[testDocEntity1], 1]);
      await expect(
        controller.getAllDocs(
          testOffsetAndLimit1,
          testOrganizationEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testDocSearchResult1],
      });
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledWith(
        DocEntity,
        testOffsetAndLimit1,
        testOrganizationEntity1,
        { team: testTeamEntity1 },
      );
      expect(entityService.createDocSearchResults).toHaveBeenCalledTimes(1);
      expect(entityService.createDocSearchResults).toHaveBeenCalledWith([
        testDocEntity1,
      ]);
    });
  });

  describe('getAllQnas', () => {
    it('should get qna results', async () => {
      jest
        .spyOn(entityService, 'findPostsByOrgAndCount')
        .mockResolvedValue([[testQnaEntity1], 1]);
      await expect(
        controller.getAllQnas(
          testOffsetAndLimit1,
          testOrganizationEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        total: 1,
        results: [testQnaSearchResult1],
      });
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledTimes(1);
      expect(entityService.findPostsByOrgAndCount).toHaveBeenCalledWith(
        QnaEntity,
        testOffsetAndLimit1,
        testOrganizationEntity1,
        { team: testTeamEntity1 },
      );
      expect(entityService.createQnaSearchResults).toHaveBeenCalledTimes(1);
      expect(entityService.createQnaSearchResults).toHaveBeenCalledWith([
        testQnaEntity1,
      ]);
    });
  });
});
