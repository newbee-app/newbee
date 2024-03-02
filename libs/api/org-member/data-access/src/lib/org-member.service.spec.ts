import { createMock } from '@golevelup/ts-jest';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
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
  let txEm: EntityManager;
  let solrCli: SolrCli;
  let entityService: EntityService;

  beforeEach(async () => {
    txEm = createMock<EntityManager>({
      assign: jest.fn().mockReturnValue(testOrgMemberEntity1),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgMemberService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testOrgMemberEntity1),
            transactional: jest.fn().mockImplementation(async (cb) => {
              return await cb(txEm);
            }),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
      ],
    }).compile();

    service = module.get<OrgMemberService>(OrgMemberService);
    em = module.get<EntityManager>(EntityManager);
    solrCli = module.get<SolrCli>(SolrCli);
    entityService = module.get<EntityService>(EntityService);

    jest.clearAllMocks();
    mockOrgMemberEntity.mockReturnValue(testOrgMemberEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(txEm).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrgMemberEntity).toHaveBeenCalledTimes(1);
      expect(mockOrgMemberEntity).toHaveBeenCalledWith(
        testUserEntity1,
        testOrganizationEntity1,
        testOrgMemberEntity1.role,
      );
      expect(txEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.persistAndFlush).toHaveBeenCalledWith(testOrgMemberEntity1);
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

    it('should throw a BadRequestException if user is already in the organization', async () => {
      jest
        .spyOn(txEm, 'persistAndFlush')
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
  });

  describe('findOneByOrgAndUser', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(OrgMemberEntity, {
        user: testUserEntity1,
        organization: testOrganizationEntity1,
      });
    });

    it('should find an org member', async () => {
      await expect(
        service.findOneByOrgAndUser(testUserEntity1, testOrganizationEntity1),
      ).resolves.toEqual(testOrgMemberEntity1);
    });

    it('should throw a NotFoundException if user does not exist in the organization', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneByOrgAndUser(testUserEntity1, testOrganizationEntity1),
      ).rejects.toThrow(new NotFoundException(orgMemberNotFound));
    });
  });

  describe('findOneByOrgAndUserOrNull', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(OrgMemberEntity, {
        user: testUserEntity1,
        organization: testOrganizationEntity1,
      });
    });

    it('should find an org member', async () => {
      await expect(
        service.findOneByOrgAndUserOrNull(
          testUserEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toEqual(testOrgMemberEntity1);
    });
  });

  describe('findOneByOrgAndSlug', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(OrgMemberEntity, {
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

    it('should throw a NotFoundException if user does not exist in the organization', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneByOrgAndSlug(
          testOrganizationEntity1,
          testOrgMemberEntity1.slug,
        ),
      ).rejects.toThrow(new NotFoundException(orgMemberNotFound));
    });
  });

  describe('updateRole', () => {
    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(
          testOrgMemberEntity1,
          testOrgMemberEntity1.role,
          OrgRoleEnum.Owner,
        ),
      ).resolves.toEqual(testOrgMemberEntity1);
      expect(txEm.assign).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledWith(testOrgMemberEntity1, {
        role: testOrgMemberEntity1.role,
      });
      expect(txEm.flush).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrgMemberEntity1.organization.id,
        testOrgMemberDocParams1,
      );
    });
  });

  describe('delete', () => {
    it('should delete an org member', async () => {
      await expect(
        service.delete(testOrgMemberEntity1),
      ).resolves.toBeUndefined();
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(
        testOrgMemberEntity1,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledWith(testOrgMemberEntity1);
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrgMemberEntity1.organization.id,
        { id: testOrgMemberEntity1.id },
      );
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
