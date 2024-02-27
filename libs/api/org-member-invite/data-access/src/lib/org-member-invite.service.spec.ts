import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
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
  EntityService,
  OrgMemberInviteEntity,
  UserEntity,
  testOrgMemberEntity1,
  testOrgMemberInviteEntity1,
  testOrganizationEntity1,
  testUserEntity1,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { elongateUuid, shortenUuid } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  forbiddenError,
  internalServerError,
  orgMemberAlreadyBadRequest,
  orgMemberInviteTokenNotFound,
  orgMemberInvitedBadRequest,
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
  let em: EntityManager;
  let configService: ConfigService;
  let mailerService: MailerService;
  let entityService: EntityService;
  let userService: UserService;
  let userInvitesService: UserInvitesService;
  let orgMemberService: OrgMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgMemberInviteService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(testOrgMemberInviteEntity1),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockReturnValue(''),
          }),
        },
        {
          provide: MailerService,
          useValue: createMock<MailerService>(),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            findOneByEmailOrNull: jest.fn().mockResolvedValue(null),
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
          }),
        },
      ],
    }).compile();

    service = module.get<OrgMemberInviteService>(OrgMemberInviteService);
    em = module.get<EntityManager>(EntityManager);
    configService = module.get<ConfigService>(ConfigService);
    mailerService = module.get<MailerService>(MailerService);
    entityService = module.get<EntityService>(EntityService);
    userService = module.get<UserService>(UserService);
    userInvitesService = module.get<UserInvitesService>(UserInvitesService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);

    jest.clearAllMocks();
    mockV4.mockReturnValue(testOrgMemberInviteEntity1.id);
    mockOrgMemberInviteEntity.mockReturnValue(testOrgMemberInviteEntity1);
    mockShortenUuid.mockReturnValue(testOrgMemberInviteEntity1.token);
    mockElongateUuid.mockReturnValue(testOrgMemberInviteEntity1.id);
    testUserInvitesEntity1.orgMemberInvites = createMock<
      Collection<OrgMemberInviteEntity>
    >({
      length: 2,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(configService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userService).toBeDefined();
    expect(userInvitesService).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(userService.findOneByEmailOrNull).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmailOrNull).toHaveBeenCalledWith(
        testUserEntity1.email,
      );
    });

    it('should throw a BadRequestException if invitee is already an org member', async () => {
      jest
        .spyOn(userService, 'findOneByEmailOrNull')
        .mockResolvedValue(testUserEntity1);
      jest
        .spyOn(orgMemberService, 'findOneByOrgAndUserOrNull')
        .mockResolvedValue(testOrgMemberEntity1);
      await expect(
        service.create(
          testOrgMemberInviteEntity1.userInvites.email,
          testOrgMemberInviteEntity1.role,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).rejects.toThrow(new BadRequestException(orgMemberAlreadyBadRequest));
    });

    describe('passes org member check', () => {
      afterEach(() => {
        expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledTimes(
          1,
        );
        expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledWith(
          testUserEntity1.email,
        );
        expect(mockShortenUuid).toHaveBeenCalledTimes(1);
        expect(mockShortenUuid).toHaveBeenCalledWith(
          testOrgMemberInviteEntity1.id,
        );
        expect(mockOrgMemberInviteEntity).toHaveBeenCalledTimes(1);
        expect(mockOrgMemberInviteEntity).toHaveBeenCalledWith(
          testOrgMemberInviteEntity1.id,
          testUserInvitesEntity1,
          testOrgMemberEntity1,
          testOrgMemberInviteEntity1.role,
        );
        expect(configService.get).toHaveBeenCalledTimes(2);
        expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
        expect(em.persistAndFlush).toHaveBeenCalledWith(
          testOrgMemberInviteEntity1,
        );
      });

      it('should create an org member invite and send an email', async () => {
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testOrgMemberInviteEntity1.role,
            testOrgMemberEntity1,
            testOrganizationEntity1,
          ),
        ).resolves.toEqual(testOrgMemberInviteEntity1);
      });

      it('should throw a BadRequestException if persistAndFlush throws a UniqueConstraintViolationException', async () => {
        jest
          .spyOn(em, 'persistAndFlush')
          .mockRejectedValue(
            new UniqueConstraintViolationException(
              new Error('persistAndFlush'),
            ),
          );
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testOrgMemberInviteEntity1.role,
            testOrgMemberEntity1,
            testOrganizationEntity1,
          ),
        ).rejects.toThrow(new BadRequestException(orgMemberInvitedBadRequest));
      });

      it('should throw an InternalServerErrorException if persistAndFlush throws any other type of error', async () => {
        jest
          .spyOn(em, 'persistAndFlush')
          .mockRejectedValue(new Error('persistAndFlush'));
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testOrgMemberInviteEntity1.role,
            testOrgMemberEntity1,
            testOrganizationEntity1,
          ),
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
      });

      it('should throw an InternalServerErrorException if sendMail throws an error', async () => {
        jest
          .spyOn(mailerService, 'sendMail')
          .mockRejectedValue(new Error('sendMail'));
        await expect(
          service.create(
            testOrgMemberInviteEntity1.userInvites.email,
            testOrgMemberInviteEntity1.role,
            testOrgMemberEntity1,
            testOrganizationEntity1,
          ),
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
        );
        expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('findOneByToken', () => {
    afterEach(() => {
      expect(mockElongateUuid).toHaveBeenCalledTimes(1);
      expect(mockElongateUuid).toHaveBeenCalledWith(
        testOrgMemberInviteEntity1.token,
      );
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        OrgMemberInviteEntity,
        testOrgMemberInviteEntity1.id,
      );
    });

    it('should find an org member invite by token', async () => {
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token),
      ).resolves.toEqual(testOrgMemberInviteEntity1);
    });

    it('throws a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token),
      ).rejects.toThrow(new NotFoundException(orgMemberInviteTokenNotFound));
    });

    it('throws an InternalServerErrorException if findOneOrFail throws any other error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(em.populate).toHaveBeenCalledTimes(1);
      expect(em.populate).toHaveBeenCalledWith(testOrgMemberInviteEntity1, [
        'userInvites.orgMemberInvites',
        'userInvites.user',
      ]);
    });

    describe('more than one org member invite', () => {
      afterEach(() => {
        expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
        expect(entityService.safeToDelete).toHaveBeenCalledWith(
          testOrgMemberInviteEntity1,
        );
        expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
        expect(em.removeAndFlush).toHaveBeenCalledWith(
          testOrgMemberInviteEntity1,
        );
      });

      it('should only delete the org member invite', async () => {
        await expect(
          service.delete(testOrgMemberInviteEntity1),
        ).resolves.toBeUndefined();
      });

      it('throws an InternalServerErrorException if removeAndFlush throws an error', async () => {
        jest
          .spyOn(em, 'removeAndFlush')
          .mockRejectedValue(new Error('removeAndFlush'));
        await expect(
          service.delete(testOrgMemberInviteEntity1),
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerError),
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
        service.acceptInvite(testOrgMemberInviteEntity1.token, testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.populate).toHaveBeenCalledTimes(1);
      expect(em.populate).toHaveBeenCalledWith(testOrgMemberInviteEntity1, [
        'userInvites.user',
      ]);
    });

    it('should throw a ForbiddenException if the request and invitee are not the same user', async () => {
      await expect(
        service.acceptInvite(
          testOrgMemberInviteEntity1.token,
          createMock<UserEntity>(),
        ),
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should create a new org member and delete the invite', async () => {
      await expect(
        service.acceptInvite(testOrgMemberInviteEntity1.token, testUserEntity1),
      ).resolves.toEqual(testOrgMemberEntity1);
      expect(em.populate).toHaveBeenCalledTimes(2);
      expect(em.populate).toHaveBeenCalledWith(testOrgMemberInviteEntity1, [
        'organization',
      ]);
      expect(orgMemberService.create).toHaveBeenCalledTimes(1);
      expect(orgMemberService.create).toHaveBeenCalledWith(
        testUserEntity1,
        testOrgMemberInviteEntity1.organization,
        testOrgMemberInviteEntity1.role,
      );
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(testOrgMemberInviteEntity1);
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
        service.declineInvite(
          testOrgMemberInviteEntity1.token,
          testUserEntity1,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.populate).toHaveBeenCalledTimes(1);
      expect(em.populate).toHaveBeenCalledWith(testOrgMemberInviteEntity1, [
        'userInvites.user',
      ]);
    });

    it('should throw a ForbiddenException if the request and invitee are not the same user', async () => {
      await expect(
        service.declineInvite(
          testOrgMemberInviteEntity1.token,
          createMock<UserEntity>(),
        ),
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should delete the invite', async () => {
      await expect(
        service.declineInvite(
          testOrgMemberInviteEntity1.token,
          testUserEntity1,
        ),
      ).resolves.toBeUndefined();
      expect(em.populate).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(testOrgMemberInviteEntity1);
    });
  });
});
