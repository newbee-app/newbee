import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  OrgMemberInviteEntity,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testOrgMemberInviteEntity1,
  testUserEntity1,
  testUserInvitesEntity1,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { elongateUuid, shortenUuid } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  forbiddenError,
  internalServerError,
  orgMemberAlreadyBadRequest,
  orgMemberInvitedBadRequest,
  orgMemberInviteTokenNotFound,
  userEmailNotFound,
} from '@newbee/shared/util';
import { v4 } from 'uuid';
import { OrgMemberInviteService } from './org-member-invite.service';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  OrgMemberInviteEntity: jest.fn(),
}));
const mockOrgMemberInviteEntity = OrgMemberInviteEntity as jest.Mock;

jest.mock('@newbee/api/shared/util', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/util'),
  shortenUuid: jest.fn(),
  elongateUuid: jest.fn(),
}));
const mockShortenUuid = shortenUuid as jest.Mock;
const mockElongateUuid = elongateUuid as jest.Mock;

describe('OrgMemberInviteService', () => {
  let service: OrgMemberInviteService;
  let repository: EntityRepository<OrgMemberInviteEntity>;
  let em: EntityManager;
  let userService: UserService;
  let userInvitesService: UserInvitesService;
  let orgMemberService: OrgMemberService;
  let mailerService: MailerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgMemberInviteService,
        {
          provide: getRepositoryToken(OrgMemberInviteEntity),
          useValue: createMock<EntityRepository<OrgMemberInviteEntity>>({
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(testOrgMemberInviteEntity1),
          }),
        },
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>(),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            findOneByEmail: jest
              .fn()
              .mockRejectedValue(new NotFoundException(userEmailNotFound)),
          }),
        },
        {
          provide: UserInvitesService,
          useValue: createMock<UserInvitesService>({
            findOrCreateOneByEmail: jest
              .fn()
              .mockResolvedValue(testUserInvitesEntity1),
          }),
        },
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            create: jest.fn().mockResolvedValue(testOrgMemberEntity1),
            findOneByUserAndOrg: jest
              .fn()
              .mockResolvedValue(testOrgMemberEntity1),
          }),
        },
        {
          provide: MailerService,
          useValue: createMock<MailerService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockReturnValue(''),
          }),
        },
      ],
    }).compile();

    service = module.get<OrgMemberInviteService>(OrgMemberInviteService);
    repository = module.get<EntityRepository<OrgMemberInviteEntity>>(
      getRepositoryToken(OrgMemberInviteEntity)
    );
    em = module.get<EntityManager>(EntityManager);
    userService = module.get<UserService>(UserService);
    userInvitesService = module.get<UserInvitesService>(UserInvitesService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
    mockV4.mockReturnValue(testOrgMemberInviteEntity1.id);
    mockOrgMemberInviteEntity.mockReturnValue(testOrgMemberInviteEntity1);
    mockShortenUuid.mockReturnValue(testOrgMemberInviteEntity1.token);
    mockElongateUuid.mockReturnValue(testOrgMemberInviteEntity1.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(em).toBeDefined();
    expect(userService).toBeDefined();
    expect(userInvitesService).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(userService.findOneByEmail).toBeCalledTimes(1);
      expect(userService.findOneByEmail).toBeCalledWith(testUserEntity1.email);
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledTimes(1);
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
        testUserEntity1,
        testOrganizationEntity1
      );
    });

    it('should throw a BadRequestException if invitee is already an org member', async () => {
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue(testUserEntity1);
      await expect(
        service.create(
          testOrgMemberInviteEntity1.userInvites.email,
          testUserEntity1,
          testOrgMemberInviteEntity1.role,
          testOrganizationEntity1
        )
      ).rejects.toThrow(new BadRequestException(orgMemberAlreadyBadRequest));
    });

    describe('passes org member check', () => {
      afterEach(() => {
        expect(userInvitesService.findOrCreateOneByEmail).toBeCalledTimes(1);
        expect(userInvitesService.findOrCreateOneByEmail).toBeCalledWith(
          testUserEntity1.email
        );
        expect(mockShortenUuid).toBeCalledTimes(1);
        expect(mockShortenUuid).toBeCalledWith(testOrgMemberInviteEntity1.id);
        expect(mockOrgMemberInviteEntity).toBeCalledTimes(1);
        expect(mockOrgMemberInviteEntity).toBeCalledWith(
          testOrgMemberInviteEntity1.id,
          testUserInvitesEntity1,
          testOrgMemberEntity1,
          testOrgMemberInviteEntity1.role
        );
        expect(configService.get).toBeCalledTimes(2);
        expect(repository.persistAndFlush).toBeCalledTimes(1);
        expect(repository.persistAndFlush).toBeCalledWith(
          testOrgMemberInviteEntity1
        );
      });

      it('should create an org member invite and send an email', async () => {
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testUserEntity1,
            testOrgMemberInviteEntity1.role,
            testOrganizationEntity1
          )
        ).resolves.toEqual(testOrgMemberInviteEntity1);
      });

      it('should throw a BadRequestException if persistAndFlush throws a UniqueConstraintViolationException', async () => {
        jest
          .spyOn(repository, 'persistAndFlush')
          .mockRejectedValue(
            new UniqueConstraintViolationException(new Error('persistAndFlush'))
          );
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testUserEntity1,
            testOrgMemberInviteEntity1.role,
            testOrganizationEntity1
          )
        ).rejects.toThrow(new BadRequestException(orgMemberInvitedBadRequest));
      });

      it('should throw an InternalServerErrorException if persistAndFlush throws any other type of error', async () => {
        jest
          .spyOn(repository, 'persistAndFlush')
          .mockRejectedValue(new Error('persistAndFlush'));
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testUserEntity1,
            testOrgMemberInviteEntity1.role,
            testOrganizationEntity1
          )
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError)
        );
      });

      it('should throw an InternalServerErrorException if sendMail throws an error', async () => {
        jest
          .spyOn(mailerService, 'sendMail')
          .mockRejectedValue(new Error('sendMail'));
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testUserEntity1,
            testOrgMemberInviteEntity1.role,
            testOrganizationEntity1
          )
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError)
        );
        expect(mailerService.sendMail).toBeCalledTimes(1);
      });
    });
  });

  describe('findOneByToken', () => {
    afterEach(() => {
      expect(mockElongateUuid).toBeCalledTimes(1);
      expect(mockElongateUuid).toBeCalledWith(testOrgMemberInviteEntity1.token);
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(
        testOrgMemberInviteEntity1.id
      );
    });

    it('should find an org member invite by token', async () => {
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token)
      ).resolves.toEqual(testOrgMemberInviteEntity1);
    });

    it('throws a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token)
      ).rejects.toThrow(new NotFoundException(orgMemberInviteTokenNotFound));
    });

    it('throws an InternalServerErrorException if findOneOrFail throws any other error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(em.populate).toBeCalledTimes(1);
      expect(em.populate).toBeCalledWith(testOrgMemberInviteEntity1, [
        'userInvites.orgMemberInvites',
        'userInvites.user',
      ]);
    });

    describe('more than one org member invite', () => {
      afterEach(() => {
        expect(repository.removeAndFlush).toBeCalledTimes(1);
        expect(repository.removeAndFlush).toBeCalledWith(
          testOrgMemberInviteEntity1
        );
      });

      it('should only delete the org member invite', async () => {
        await expect(
          service.delete(testOrgMemberInviteEntity1)
        ).resolves.toBeUndefined();
      });

      it('throws an InternalServerErrorException if removeAndFlush throws an error', async () => {
        jest
          .spyOn(repository, 'removeAndFlush')
          .mockRejectedValue(new Error('removeAndFlush'));
        await expect(
          service.delete(testOrgMemberInviteEntity1)
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError)
        );
      });
    });
  });

  describe('acceptInvite', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'findOneByToken')
        .mockResolvedValue(testOrgMemberInviteEntity1);
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);
    });

    it('should throw an InternalServerErrorException if populate throws an error', async () => {
      jest.spyOn(em, 'populate').mockRejectedValue(new Error('populate'));
      await expect(
        service.acceptInvite(testOrgMemberInviteEntity1.token, testUserEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.populate).toBeCalledTimes(1);
      expect(em.populate).toBeCalledWith(testOrgMemberInviteEntity1, [
        'userInvites.user',
      ]);
    });

    it('should throw a ForbiddenException if the request and invitee are not the same user', async () => {
      await expect(
        service.acceptInvite(
          testOrgMemberInviteEntity1.token,
          createMock<UserEntity>()
        )
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should create a new org member and delete the invite', async () => {
      await expect(
        service.acceptInvite(testOrgMemberInviteEntity1.token, testUserEntity1)
      ).resolves.toEqual(testOrgMemberEntity1);
      expect(em.populate).toBeCalledTimes(2);
      expect(em.populate).toBeCalledWith(OrgMemberInviteEntity, [
        'organization',
      ]);
      expect(orgMemberService.create).toBeCalledTimes(1);
      expect(orgMemberService.create).toBeCalledWith(
        testUserEntity1,
        testOrgMemberInviteEntity1.organization,
        testOrgMemberInviteEntity1.role
      );
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testOrgMemberInviteEntity1);
    });
  });

  describe('declineInvite', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'findOneByToken')
        .mockResolvedValue(testOrgMemberInviteEntity1);
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);
    });

    it('should throw an InternalServerErrorException if populate throws an error', async () => {
      jest.spyOn(em, 'populate').mockRejectedValue(new Error('populate'));
      await expect(
        service.declineInvite(testOrgMemberInviteEntity1.token, testUserEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.populate).toBeCalledTimes(1);
      expect(em.populate).toBeCalledWith(testOrgMemberInviteEntity1, [
        'userInvites.user',
      ]);
    });

    it('should throw a ForbiddenException if the request and invitee are not the same user', async () => {
      await expect(
        service.declineInvite(
          testOrgMemberInviteEntity1.token,
          createMock<UserEntity>()
        )
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should delete the invite', async () => {
      await expect(
        service.declineInvite(testOrgMemberInviteEntity1.token, testUserEntity1)
      ).resolves.toBeUndefined();
      expect(em.populate).toBeCalledTimes(1);
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testOrgMemberInviteEntity1);
    });
  });
});
