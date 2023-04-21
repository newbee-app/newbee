import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DocService } from '@newbee/api/doc/data-access';
import {
  testDocEntity1,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateDocDto1,
  testBaseTeamSlugDto1,
  testBaseUpdateDocDto1,
} from '@newbee/shared/data-access';
import { DocController } from './doc.controller';

describe('DocController', () => {
  let controller: DocController;
  let service: DocService;

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
      ],
    }).compile();

    controller = module.get<DocController>(DocController);
    service = module.get<DocService>(DocService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('create should create a doc', async () => {
    await expect(
      controller.create(
        testBaseCreateDocDto1,
        testOrgMemberEntity1,
        testOrganizationEntity1,
        testTeamEntity1,
        testBaseTeamSlugDto1
      )
    ).resolves.toEqual(testDocEntity1);
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(
      testBaseCreateDocDto1,
      testTeamEntity1,
      testOrgMemberEntity1
    );
  });

  it('get should get a doc', async () => {
    await expect(controller.get(testDocEntity1)).resolves.toEqual(
      testDocEntity1
    );
  });

  it('update should update a doc', async () => {
    await expect(
      controller.update(testBaseUpdateDocDto1, testDocEntity1)
    ).resolves.toEqual(testUpdatedDocEntity);
    expect(service.update).toBeCalledTimes(1);
    expect(service.update).toBeCalledWith(
      testDocEntity1,
      testBaseUpdateDocDto1
    );
  });

  it('markUpToDate should mark a doc as up-to-date', async () => {
    await expect(controller.markUpToDate(testDocEntity1)).resolves.toEqual(
      testUpdatedDocEntity
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
