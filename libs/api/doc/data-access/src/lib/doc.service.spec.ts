import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DocEntity,
  testDocEntity1,
  testOrganizationEntity1,
  testTeamEntity1,
  testUserOrganizationEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateDocDto1,
  testBaseUpdateDocDto1,
} from '@newbee/shared/data-access';
import {
  docSlugNotFound,
  docSlugTakenBadRequest,
  internalServerError,
} from '@newbee/shared/util';
import { DocService } from './doc.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  DocEntity: jest.fn(),
}));
const mockDocEntity = DocEntity as jest.Mock;

describe('DocService', () => {
  let service: DocService;
  let repository: EntityRepository<DocEntity>;

  const testUpdatedDocEntity = { ...testDocEntity1, ...testBaseUpdateDocDto1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocService,
        {
          provide: getRepositoryToken(DocEntity),
          useValue: createMock<EntityRepository<DocEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testDocEntity1),
            assign: jest.fn().mockResolvedValue(testUpdatedDocEntity),
          }),
        },
      ],
    }).compile();

    service = module.get<DocService>(DocService);
    repository = module.get<EntityRepository<DocEntity>>(
      getRepositoryToken(DocEntity)
    );

    jest.clearAllMocks();
    mockDocEntity.mockReturnValue(testDocEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockDocEntity).toBeCalledTimes(1);
      expect(mockDocEntity).toBeCalledWith(
        testTeamEntity1,
        testDocEntity1.slug,
        testDocEntity1.rawMarkdown,
        testUserOrganizationEntity1
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(testDocEntity1);
    });

    it('should create a doc', async () => {
      await expect(
        service.create(
          testBaseCreateDocDto1,
          testTeamEntity1,
          testUserOrganizationEntity1
        )
      ).resolves.toEqual(testDocEntity1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(
          testBaseCreateDocDto1,
          testTeamEntity1,
          testUserOrganizationEntity1
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if slug already exists', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush'))
        );
      await expect(
        service.create(
          testBaseCreateDocDto1,
          testTeamEntity1,
          testUserOrganizationEntity1
        )
      ).rejects.toThrow(new BadRequestException(docSlugTakenBadRequest));
    });
  });

  describe('findBySlug', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        organization: testOrganizationEntity1,
        slug: testDocEntity1.slug,
      });
    });

    it('should find a slug', async () => {
      await expect(
        service.findBySlug(testOrganizationEntity1, testDocEntity1.slug)
      ).resolves.toEqual(testDocEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findBySlug(testOrganizationEntity1, testDocEntity1.slug)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if doc cannot be found', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findBySlug(testOrganizationEntity1, testDocEntity1.slug)
      ).rejects.toThrow(new NotFoundException(docSlugNotFound));
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(
        testDocEntity1,
        testBaseUpdateDocDto1
      );
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update a doc', async () => {
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).resolves.toEqual(testUpdatedDocEntity);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if udpated slug is already taken', async () => {
      jest
        .spyOn(repository, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush'))
        );
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).rejects.toThrow(new BadRequestException(docSlugTakenBadRequest));
    });
  });

  describe('delete', () => {
    it('should delete a doc', async () => {
      await expect(service.delete(testDocEntity1)).resolves.toBeUndefined();
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testDocEntity1);
    });
  });
});
