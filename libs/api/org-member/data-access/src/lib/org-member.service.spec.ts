import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EntityService,
  OrgMemberEntity,
  testOrgMemberDocParams1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  OrgRoleEnum,
  forbiddenError,
  internalServerError,
  orgMemberNotFound,
  userAlreadyOrgMemberBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { OrgMemberService } from './org-member.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  OrgMemberEntity: jest.fn(),
}));
const mockOrgMemberEntity = OrgMemberEntity as jest.Mock;

describe('OrgMemberService', () => {
  let service: OrgMemberService;
  let em: EntityManager;
  let entityService: EntityService;
  let solrCli: SolrCli;

  const testUpdatedOrgMember = createMock<OrgMemberEntity>({
    ...testOrgMemberEntity1,
    role: OrgRoleEnum.Moderator,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgMemberService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOneOrFail: jest.fn().mockResolvedValue(testOrgMemberEntity1),
            findOne: jest.fn().mockResolvedValue(testOrgMemberEntity1),
            find: jest.fn().mockResolvedValue([testOrgMemberEntity1]),
            assign: jest.fn().mockResolvedValue(testUpdatedOrgMember),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createOrgMemberDocParams: jest
              .fn()
              .mockResolvedValue(testOrgMemberDocParams1),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get<OrgMemberService>(OrgMemberService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    solrCli = module.get<SolrCli>(SolrCli);

    jest.clearAllMocks();
    mockOrgMemberEntity.mockReturnValue(testOrgMemberEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrgMemberEntity).toHaveBeenCalledTimes(1);
      expect(mockOrgMemberEntity).toHaveBeenCalledWith(
        testUserEntity1,
        testOrganizationEntity1,
        testOrgMemberEntity1.role,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testOrgMemberEntity1);
    });

    it('should create a new org member', async () => {
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role,
        ),
      ).resolves.toEqual(testOrgMemberEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testOrgMemberDocParams1,
      );
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if user is already in the organization', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role,
        ),
      ).rejects.toThrow(
        new BadRequestException(userAlreadyOrgMemberBadRequest),
      );
    });

    it('should throw an InternalServerErrorException and delete if addDocs throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(
          testUserEntity1,
          testOrganizationEntity1,
          testOrgMemberEntity1.role,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testOrgMemberDocParams1,
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testOrgMemberEntity1);
    });
  });

  describe('findOneByUserAndOrg', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(OrgMemberEntity, {
        user: testUserEntity1,
        organization: testOrganizationEntity1,
      });
    });

    it('should find an org member', async () => {
      await expect(
        service.findOneByUserAndOrg(testUserEntity1, testOrganizationEntity1),
      ).resolves.toEqual(testOrgMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByUserAndOrg(testUserEntity1, testOrganizationEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if user does not exist in the organization', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByUserAndOrg(testUserEntity1, testOrganizationEntity1),
      ).rejects.toThrow(new NotFoundException(orgMemberNotFound));
    });
  });

  describe('findOneByUserAndOrgOrNull', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(OrgMemberEntity, {
        user: testUserEntity1,
        organization: testOrganizationEntity1,
      });
    });

    it('should find an org member', async () => {
      await expect(
        service.findOneByUserAndOrgOrNull(
          testUserEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual(testOrgMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByUserAndOrgOrNull(
          testUserEntity1,
          testOrganizationEntity1,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneByOrgAndSlug', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(OrgMemberEntity, {
        organization: testOrganizationEntity1,
        slug: testOrgMemberEntity1.slug,
      });
    });

    it('should find an org member', async () => {
      await expect(
        service.findOneByOrgAndSlug(
          testOrganizationEntity1,
          testOrgMemberEntity1.slug,
        ),
      ).resolves.toEqual(testOrgMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByOrgAndSlug(
          testOrganizationEntity1,
          testOrgMemberEntity1.slug,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if user does not exist in the organization', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByOrgAndSlug(
          testOrganizationEntity1,
          testOrgMemberEntity1.slug,
        ),
      ).rejects.toThrow(new NotFoundException(orgMemberNotFound));
    });
  });

  describe('updateRole', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testOrgMemberEntity1, {
        role: testUpdatedOrgMember.role,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(
          testOrgMemberEntity1,
          testUpdatedOrgMember.role,
          OrgRoleEnum.Owner,
        ),
      ).resolves.toEqual(testUpdatedOrgMember);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateRole(
          testOrgMemberEntity1,
          testUpdatedOrgMember.role,
          OrgRoleEnum.Owner,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(
        testOrgMemberEntity1,
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testOrgMemberEntity1);
    });

    it('should delete an org member', async () => {
      await expect(
        service.delete(testOrgMemberEntity1),
      ).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testOrgMemberEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should not throw if deleteDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteDocs')
        .mockRejectedValue(new Error('deleteDocs'));
      await expect(
        service.delete(testOrgMemberEntity1),
      ).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkRequesterOrgRole', () => {
    it(`should pass if the requester's org role is greater than or equal to the subject's org role`, () => {
      expect(
        OrgMemberService.checkRequesterOrgRole(
          OrgRoleEnum.Owner,
          OrgRoleEnum.Owner,
        ),
      ).toBeUndefined();
      expect(
        OrgMemberService.checkRequesterOrgRole(
          OrgRoleEnum.Owner,
          OrgRoleEnum.Moderator,
        ),
      ).toBeUndefined();
      expect(
        OrgMemberService.checkRequesterOrgRole(
          OrgRoleEnum.Owner,
          OrgRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        OrgMemberService.checkRequesterOrgRole(
          OrgRoleEnum.Moderator,
          OrgRoleEnum.Moderator,
        ),
      ).toBeUndefined();
      expect(
        OrgMemberService.checkRequesterOrgRole(
          OrgRoleEnum.Moderator,
          OrgRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        OrgMemberService.checkRequesterOrgRole(
          OrgRoleEnum.Member,
          OrgRoleEnum.Member,
        ),
      ).toBeUndefined();
    });
  });

  it(`should fail if the requester's org role is lower than the subject's org role`, () => {
    expect(() =>
      OrgMemberService.checkRequesterOrgRole(
        OrgRoleEnum.Member,
        OrgRoleEnum.Moderator,
      ),
    ).toThrow(new ForbiddenException(forbiddenError));
    expect(() =>
      OrgMemberService.checkRequesterOrgRole(
        OrgRoleEnum.Member,
        OrgRoleEnum.Owner,
      ),
    ).toThrow(new ForbiddenException(forbiddenError));
    expect(() =>
      OrgMemberService.checkRequesterOrgRole(
        OrgRoleEnum.Moderator,
        OrgRoleEnum.Owner,
      ),
    ).toThrow(new ForbiddenException(forbiddenError));
  });
});
