import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  testOrganizationEntity1,
  testQnaEntity1,
  testTeamEntity1,
  testUserEntity1,
  testUserOrganizationEntity1,
} from '@newbee/api/shared/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import { UserOrganizationService } from '@newbee/api/user-organization/data-access';
import {
  testBaseCreateQnaDto1,
  testBaseUpdateQnaDto1,
} from '@newbee/shared/data-access';
import { QnaController } from './qna.controller';

describe('QnaController', () => {
  let controller: QnaController;
  let service: QnaService;
  let organizationService: OrganizationService;
  let userOrganizationService: UserOrganizationService;
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
            findOneByName: jest.fn().mockResolvedValue(testOrganizationEntity1),
          }),
        },
        {
          provide: UserOrganizationService,
          useValue: createMock<UserOrganizationService>({
            findOneByUserAndOrganization: jest
              .fn()
              .mockResolvedValue(testUserOrganizationEntity1),
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

    controller = module.get<QnaController>(QnaController);
    service = module.get<QnaService>(QnaService);
    organizationService = module.get<OrganizationService>(OrganizationService);
    userOrganizationService = module.get<UserOrganizationService>(
      UserOrganizationService
    );
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(userOrganizationService).toBeDefined();
    expect(teamService).toBeDefined();
  });

  describe('finds organization', () => {
    afterEach(() => {
      expect(organizationService.findOneByName).toBeCalledTimes(1);
      expect(organizationService.findOneByName).toBeCalledWith(
        testOrganizationEntity1.name
      );
    });

    it('create should create a qna', async () => {
      await expect(
        controller.create(
          testBaseCreateQnaDto1,
          testUserEntity1,
          testOrganizationEntity1.name,
          testTeamEntity1.name
        )
      ).resolves.toEqual(testQnaEntity1);
      expect(
        userOrganizationService.findOneByUserAndOrganization
      ).toBeCalledTimes(1);
      expect(
        userOrganizationService.findOneByUserAndOrganization
      ).toBeCalledWith(testUserEntity1, testOrganizationEntity1);
      expect(teamService.findOneByName).toBeCalledTimes(1);
      expect(teamService.findOneByName).toBeCalledWith(
        testOrganizationEntity1,
        testTeamEntity1.name
      );
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testBaseCreateQnaDto1,
        testTeamEntity1,
        testUserOrganizationEntity1
      );
    });

    describe('finds qna', () => {
      afterEach(() => {
        expect(service.findOneBySlug).toBeCalledTimes(1);
        expect(service.findOneBySlug).toBeCalledWith(
          testOrganizationEntity1,
          testQnaEntity1.slug
        );
      });

      it('get should get a qna', async () => {
        await expect(
          controller.get(testOrganizationEntity1.name, testQnaEntity1.slug)
        ).resolves.toEqual(testQnaEntity1);
      });

      it('update should update a qna', async () => {
        await expect(
          controller.update(
            testOrganizationEntity1.name,
            testQnaEntity1.slug,
            testBaseUpdateQnaDto1
          )
        ).resolves.toEqual(testUpdatedQnaEntity);
        expect(service.update).toBeCalledTimes(1);
        expect(service.update).toBeCalledWith(
          testQnaEntity1,
          testBaseUpdateQnaDto1
        );
      });

      it('delete should delete a qna', async () => {
        await expect(
          controller.delete(testOrganizationEntity1.name, testQnaEntity1.slug)
        ).resolves.toBeUndefined();
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(testQnaEntity1);
      });
    });
  });
});
