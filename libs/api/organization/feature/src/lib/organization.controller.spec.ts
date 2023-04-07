import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  testOrganizationEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateOrganizationDto1,
  testBaseUpdateOrganizationDto1,
} from '@newbee/shared/data-access';
import { OrganizationController } from './organization.controller';

describe('OrganizationController', () => {
  let controller: OrganizationController;
  let service: OrganizationService;

  const testUpdatedOrganizationEntity = {
    ...testOrganizationEntity1,
    ...testBaseUpdateOrganizationDto1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        {
          provide: OrganizationService,
          useValue: createMock<OrganizationService>({
            create: jest.fn().mockResolvedValue(testOrganizationEntity1),
            update: jest.fn().mockResolvedValue(testUpdatedOrganizationEntity),
          }),
        },
      ],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an organization', async () => {
      await expect(
        controller.create(testBaseCreateOrganizationDto1, testUserEntity1)
      ).resolves.toEqual(testOrganizationEntity1);
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testBaseCreateOrganizationDto1,
        testUserEntity1
      );
    });
  });

  describe('get', () => {
    it('should find and return an organization', async () => {
      await expect(controller.get(testOrganizationEntity1)).resolves.toEqual(
        testOrganizationEntity1
      );
    });
  });

  describe('update', () => {
    it('should find and update an organization', async () => {
      await expect(
        controller.update(
          testOrganizationEntity1,
          testBaseUpdateOrganizationDto1
        )
      ).resolves.toEqual(testUpdatedOrganizationEntity);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testOrganizationEntity1,
        testBaseUpdateOrganizationDto1
      );
    });
  });

  describe('delete', () => {
    it('should delete the organization', async () => {
      await expect(
        controller.delete(testOrganizationEntity1)
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testOrganizationEntity1);
    });
  });
});
