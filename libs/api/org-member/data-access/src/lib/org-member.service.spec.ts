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
import { OrgRoleEnum } from '@newbee/api/shared/util';
import {
  internalServerError,
  orgMemberNotFound,
  userAlreadyOrgMemberBadRequest,
} from '@newbee/shared/util';
import { OrgMemberService } from './org-member.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  OrgMemberEntity: jest.fn(),
}));
const mockOrgMemberEntity = OrgMemberEntity as jest.Mock;

describe('OrgMemberService', () => {
  let service: OrgMemberService;
  let repository: EntityRepository<OrgMemberEntity>;

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
      ],
    }).compile();

    service = module.get<OrgMemberService>(OrgMemberService);
    repository = module.get<EntityRepository<OrgMemberEntity>>(
      getRepositoryToken(OrgMemberEntity)
    );

    jest.clearAllMocks();
    mockOrgMemberEntity.mockReturnValue(testOrgMemberEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrgMemberEntity).toBeCalledTimes(1);
      expect(mockOrgMemberEntity).toBeCalledWith(
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
    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(testOrgMemberEntity1, testUpdatedOrgMember.role)
      ).resolves.toEqual(testUpdatedOrgMember);
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testOrgMemberEntity1, {
        role: testUpdatedOrgMember.role,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete an org member', async () => {
      await expect(
        service.delete(testOrgMemberEntity1)
      ).resolves.toBeUndefined();
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testOrgMemberEntity1);
    });
  });
});
