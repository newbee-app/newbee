import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
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
  orgMemberAlreadyBadRequest,
  orgMemberInviteTokenNotFound,
  orgMemberInvitedBadRequest,
} from '@newbee/shared/util';
import { OrgMemberInviteService } from './org-member-invite.service';

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
  let txEm: EntityManager;
  let configService: ConfigService;
  let mailerService: MailerService;
  let orgMemberService: OrgMemberService;
  let userInvitesService: UserInvitesService;
  let userService: UserService;

  beforeEach(async () => {
    txEm = createMock<EntityManager>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgMemberInviteService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testOrgMemberInviteEntity1),
            transactional: jest.fn().mockImplementation(async (cb) => {
              return await cb(txEm);
            }),
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
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            create: jest.fn().mockResolvedValue(testOrgMemberEntity1),
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
          provide: UserService,
          useValue: createMock<UserService>({
            findOneByEmailOrNull: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    service = module.get(OrgMemberInviteService);
    em = module.get(EntityManager);
    configService = module.get(ConfigService);
    mailerService = module.get(MailerService);
    orgMemberService = module.get(OrgMemberService);
    userInvitesService = module.get(UserInvitesService);
    userService = module.get(UserService);

    jest.clearAllMocks();
    mockOrgMemberInviteEntity.mockReturnValue(testOrgMemberInviteEntity1);
    mockShortenUuid.mockReturnValue(testOrgMemberInviteEntity1.token);
    mockElongateUuid.mockReturnValue(testOrgMemberInviteEntity1.id);
    testUserInvitesEntity1.user = testUserEntity1;
    testUserInvitesEntity1.orgMemberInvites = createMock<
      Collection<OrgMemberInviteEntity>
    >({
      length: 2,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(txEm).toBeDefined();
    expect(configService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(userInvitesService).toBeDefined();
    expect(userService).toBeDefined();
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
        expect(em.transactional).toHaveBeenCalledTimes(1);
        expect(mockOrgMemberInviteEntity).toHaveBeenCalledTimes(1);
        expect(mockOrgMemberInviteEntity).toHaveBeenCalledWith(
          testUserInvitesEntity1,
          testOrgMemberEntity1,
          testOrgMemberInviteEntity1.role,
        );
        expect(txEm.persistAndFlush).toHaveBeenCalledTimes(1);
        expect(txEm.persistAndFlush).toHaveBeenCalledWith(
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
        expect(mockShortenUuid).toHaveBeenCalledTimes(1);
        expect(mockShortenUuid).toHaveBeenCalledWith(
          testOrgMemberInviteEntity1.id,
        );
        expect(configService.get).toHaveBeenCalledTimes(1);
        expect(configService.get).toHaveBeenCalledWith('rpInfo.origin', {
          infer: true,
        });
        expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      });

      it('should throw a BadRequestException if persistAndFlush throws a UniqueConstraintViolationException', async () => {
        jest
          .spyOn(txEm, 'persistAndFlush')
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
    });
  });

  describe('findOneByToken', () => {
    afterEach(() => {
      expect(mockElongateUuid).toHaveBeenCalledTimes(1);
      expect(mockElongateUuid).toHaveBeenCalledWith(
        testOrgMemberInviteEntity1.token,
      );
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(
        OrgMemberInviteEntity,
        testOrgMemberInviteEntity1.id,
      );
    });

    it('should find an org member invite by token', async () => {
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token),
      ).resolves.toEqual(testOrgMemberInviteEntity1);
    });

    it('throws a NotFoundException if org member cannot be found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneByToken(testOrgMemberInviteEntity1.token),
      ).rejects.toThrow(new NotFoundException(orgMemberInviteTokenNotFound));
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

    it('should delete the org member invite and user invites if only one org member invite', async () => {
      testUserInvitesEntity1.orgMemberInvites = createMock<
        Collection<OrgMemberInviteEntity>
      >({
        length: 1,
      });
      testUserInvitesEntity1.user = null;
      await expect(
        service.delete(testOrgMemberInviteEntity1),
      ).resolves.toBeUndefined();
      expect(userInvitesService.delete).toHaveBeenCalledTimes(1);
      expect(userInvitesService.delete).toHaveBeenCalledWith(
        testUserInvitesEntity1,
      );
    });

    it('should only delete the org member invite if more than one org member invite', async () => {
      await expect(
        service.delete(testOrgMemberInviteEntity1),
      ).resolves.toBeUndefined();
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(
        testOrgMemberInviteEntity1,
      );
    });
  });

  describe('acceptInvite', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'findOneByToken')
        .mockResolvedValue(testOrgMemberInviteEntity1);
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);
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
