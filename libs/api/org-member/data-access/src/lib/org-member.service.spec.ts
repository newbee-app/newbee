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
  OrgMemberEntity,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { OrgRoleEnum, SolrEntryEnum } from '@newbee/api/shared/util';
import {
  internalServerError,
  orgMemberNotFound,
  userAlreadyOrgMemberBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { v4 } from 'uuid';
import { OrgMemberService } from './org-member.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  OrgMemberEntity: jest.fn(),
}));
const mockOrgMemberEntity = OrgMemberEntity as jest.Mock;

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('OrgMemberService', () => {
  let service: OrgMemberService;
  let repository: EntityRepository<OrgMemberEntity>;
  let solrCli: SolrCli;

  const testUpdatedOrgMember = {
    ...testOrgMemberEntity1,
    role: OrgRoleEnum.Moderator,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgMemberService,
        {
          provide: getRepositoryToken(OrgMemberEntity),
          useValue: createMock<EntityRepository<OrgMemberEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testOrgMemberEntity1),
            assign: jest.fn().mockResolvedValue(testUpdatedOrgMember),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get<OrgMemberService>(OrgMemberService);
    repository = module.get<EntityRepository<OrgMemberEntity>>(
      getRepositoryToken(OrgMemberEntity)
    );
    solrCli = module.get<SolrCli>(SolrCli);

    jest.clearAllMocks();
    mockOrgMemberEntity.mockReturnValue(testOrgMemberEntity1);
    mockV4.mockReturnValue(testOrgMemberEntity1.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrgMemberEntity).toBeCalledTimes(1);
      expect(mockOrgMemberEntity).toBeCalledWith(
        testOrgMemberEntity1.id,
        testUserEntity1,
        testOrganizationEntity1,
        testOrgMemberEntity1.role
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(testOrgMemberEntity1);
    });

    it('should create a new org member', async () => {
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role
        )
      ).resolves.toEqual(testOrgMemberEntity1);
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(solrCli.addDocs).toBeCalledWith(testOrganizationEntity1.id, {
        id: testOrgMemberEntity1.id,
        entry_type: SolrEntryEnum.Member,
        name: [testUserEntity1.name, testUserEntity1.displayName],
      });
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if user is already in the organization', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush'))
        );
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role
        )
      ).rejects.toThrow(
        new BadRequestException(userAlreadyOrgMemberBadRequest)
      );
    });

    it('should throw an InternalServerErrorException and delete if addDocs throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testOrgMemberEntity1);
    });
  });

  describe('findOneByUserAndOrg', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        user: testUserEntity1,
        organization: testOrganizationEntity1,
      });
    });

    it('should find an org member', async () => {
      await expect(
        service.findOneByUserAndOrg(testUserEntity1, testOrganizationEntity1)
      ).resolves.toEqual(testOrgMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByUserAndOrg(testUserEntity1, testOrganizationEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if user does not exist in the organization', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByUserAndOrg(testUserEntity1, testOrganizationEntity1)
      ).rejects.toThrow(new NotFoundException(orgMemberNotFound));
    });
  });

  describe('updateRole', () => {
    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testOrgMemberEntity1, {
        role: testUpdatedOrgMember.role,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(testOrgMemberEntity1, testUpdatedOrgMember.role)
      ).resolves.toEqual(testUpdatedOrgMember);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateRole(testOrgMemberEntity1, testUpdatedOrgMember.role)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testOrgMemberEntity1);
    });

    it('should delete an org member', async () => {
      await expect(
        service.delete(testOrgMemberEntity1)
      ).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testOrgMemberEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should not throw if deleteDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteDocs')
        .mockRejectedValue(new Error('deleteDocs'));
      await expect(
        service.delete(testOrgMemberEntity1)
      ).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toBeCalledTimes(1);
    });
  });
});
