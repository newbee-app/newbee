import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import {
  testBaseCreateTeamDto1,
  testBaseGeneratedSlugDto1,
  testBaseGenerateSlugDto1,
  testBaseSlugDto1,
  testBaseSlugTakenDto1,
  testBaseUpdateTeamDto1,
} from '@newbee/shared/data-access';
import slug from 'slug';
import { TeamController } from './team.controller';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;

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
            update: jest.fn().mockResolvedValue(testUpdatedTeamEntity),
            hasOneBySlug: jest.fn().mockResolvedValue(true),
          }),
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('create should create a team', async () => {
    await expect(
      controller.create(
        testBaseCreateTeamDto1,
        testOrgMemberEntity1,
        testOrganizationEntity1
      )
    ).resolves.toEqual(testTeamEntity1);
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(
      testBaseCreateTeamDto1,
      testOrgMemberEntity1
    );
  });

  describe('checkSlug', () => {
    it('should return true if slug is taken, false if not', async () => {
      await expect(
        controller.checkSlug(
          testBaseSlugDto1,
          testOrganizationEntity1,
          testUserEntity1
        )
      ).resolves.toEqual(testBaseSlugTakenDto1);
      expect(service.hasOneBySlug).toBeCalledTimes(1);
      expect(service.hasOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        testBaseSlugDto1.slug
      );

      jest.spyOn(service, 'hasOneBySlug').mockResolvedValue(false);
      await expect(
        controller.checkSlug(
          testBaseSlugDto1,
          testOrganizationEntity1,
          testUserEntity1
        )
      ).resolves.toEqual({ slugTaken: false });
      expect(service.hasOneBySlug).toBeCalledTimes(2);
      expect(service.hasOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        testBaseSlugDto1.slug
      );
    });
  });

  describe('generateSlug', () => {
    it('should generate a unique slug', async () => {
      jest.spyOn(service, 'hasOneBySlug').mockResolvedValue(false);
      const sluggedBase = slug(testBaseGenerateSlugDto1.base);
      await expect(
        controller.generateSlug(
          testBaseGenerateSlugDto1,
          testOrganizationEntity1,
          testUserEntity1
        )
      ).resolves.toEqual(testBaseGeneratedSlugDto1);
      expect(service.hasOneBySlug).toBeCalledTimes(1);
      expect(service.hasOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        sluggedBase
      );
    });
  });

  describe('finds team', () => {
    it('get should find and return a team', async () => {
      await expect(
        controller.get(testOrganizationEntity1, testTeamEntity1)
      ).resolves.toEqual(testTeamEntity1);
    });

    it('udpate should find and update a team', async () => {
      await expect(
        controller.update(
          testBaseUpdateTeamDto1,
          testOrganizationEntity1,
          testTeamEntity1
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
        controller.delete(testOrganizationEntity1, testTeamEntity1)
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testTeamEntity1);
    });
  });
});
