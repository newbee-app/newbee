import { createMock } from '@golevelup/ts-jest';
import {
  QueryOrder,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EntityService,
  UserDocParams,
  UserEntity,
  WaitlistDocParams,
  WaitlistMemberEntity,
  testAdminControlsEntity1,
  testUserEntity1,
  testUserInvitesEntity1,
  testWaitlistMemberEntity1,
} from '@newbee/api/shared/data-access';
import { solrAppCollection } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  UserRoleEnum,
  alreadyOnWaitlistBadRequest,
  emailAlreadyRegisteredBadRequest,
  internalServerError,
  testCreateWaitlistMemberDto1,
  testOffsetAndLimit1,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { v4 } from 'uuid';
import { WaitlistMemberService } from './waitlist-member.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  UserEntity: jest.fn(),
  WaitlistMemberEntity: jest.fn(),
}));
const mockUserEntity = UserEntity as jest.Mock;
const mockWaitlistMemberEntity = WaitlistMemberEntity as jest.Mock;

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('WaitlistMemberService', () => {
  let service: WaitlistMemberService;
  let em: EntityManager;
  let solrCli: SolrCli;
  let configService: ConfigService;
  let mailerService: MailerService;
  let entityService: EntityService;
  let userService: UserService;
  let userInvitesService: UserInvitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitlistMemberService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testWaitlistMemberEntity1),
            findAndCount: jest
              .fn()
              .mockResolvedValue([[testWaitlistMemberEntity1], 1]),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockReturnValue('http://localhost:4200'),
          }),
        },
        {
          provide: MailerService,
          useValue: createMock<MailerService>(),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            getAdminControls: jest
              .fn()
              .mockResolvedValue(testAdminControlsEntity1),
          }),
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
      ],
    }).compile();

    service = module.get(WaitlistMemberService);
    em = module.get(EntityManager);
    solrCli = module.get(SolrCli);
    configService = module.get(ConfigService);
    mailerService = module.get(MailerService);
    entityService = module.get(EntityService);
    userService = module.get(UserService);
    userInvitesService = module.get(UserInvitesService);

    jest.clearAllMocks();
    mockUserEntity.mockReturnValue(testUserEntity1);
    mockWaitlistMemberEntity.mockReturnValue(testWaitlistMemberEntity1);
    mockV4.mockReturnValue(testUserEntity1.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(configService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userService).toBeDefined();
    expect(userInvitesService).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(userService, 'findOneByEmailOrNull').mockResolvedValue(null);
    });

    afterEach(() => {
      expect(userService.findOneByEmailOrNull).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmailOrNull).toHaveBeenCalledWith(
        testCreateWaitlistMemberDto1.email,
      );
    });

    it('should return created waitlist member', async () => {
      await expect(
        service.create(testCreateWaitlistMemberDto1),
      ).resolves.toEqual(testWaitlistMemberEntity1);
      expect(entityService.getAdminControls).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(
        testWaitlistMemberEntity1,
      );
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        solrAppCollection,
        new WaitlistDocParams(testWaitlistMemberEntity1),
      );
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest
        .spyOn(userService, 'findOneByEmailOrNull')
        .mockResolvedValue(testUserEntity1);
      await expect(
        service.create(testCreateWaitlistMemberDto1),
      ).rejects.toThrow(
        new BadRequestException(emailAlreadyRegisteredBadRequest),
      );
    });

    it('should throw BadRequestException if already on waitlist', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(testCreateWaitlistMemberDto1),
      ).rejects.toThrow(new BadRequestException(alreadyOnWaitlistBadRequest));
    });

    it('should throw InternalServerErrorException if ORM throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testCreateWaitlistMemberDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw InternalServerErrorException and delete if solrCli throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(testCreateWaitlistMemberDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testWaitlistMemberEntity1);
    });

    it('should throw InternalServerErrorException if mailer throws an error', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue(new Error('sendMail'));
      await expect(
        service.create(testCreateWaitlistMemberDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testWaitlistMemberEntity1);
    });
  });

  describe('findByEmailOrNull', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(WaitlistMemberEntity, {
        email: testWaitlistMemberEntity1.email,
      });
    });

    it('should return a waitlist member if one exists', async () => {
      await expect(
        service.findByEmailOrNull(testWaitlistMemberEntity1.email),
      ).resolves.toEqual(testWaitlistMemberEntity1);
    });

    it('should return null if none exist', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findByEmailOrNull(testWaitlistMemberEntity1.email),
      ).resolves.toEqual(null);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findByEmailOrNull(testWaitlistMemberEntity1.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('getAllAndCount', () => {
    afterEach(() => {
      expect(em.findAndCount).toHaveBeenCalledTimes(1);
      expect(em.findAndCount).toHaveBeenCalledWith(
        WaitlistMemberEntity,
        {},
        { ...testOffsetAndLimit1, orderBy: { createdAt: QueryOrder.ASC } },
      );
    });

    it('should get waitlist members and count', async () => {
      await expect(
        service.getAllAndCount(testOffsetAndLimit1),
      ).resolves.toEqual([[testWaitlistMemberEntity1], 1]);
    });

    it('should throw InternalServerErrorException if findAndCount throws an error', async () => {
      jest
        .spyOn(em, 'findAndCount')
        .mockRejectedValue(new Error('findAndCount'));
      await expect(service.getAllAndCount(testOffsetAndLimit1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('deleteAndCreateUsers', () => {
    afterEach(() => {
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledTimes(
        1,
      );
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledWith(
        testWaitlistMemberEntity1.email,
      );
      expect(mockUserEntity).toHaveBeenCalledTimes(1);
      expect(mockUserEntity).toHaveBeenCalledWith(
        testUserEntity1.id,
        testWaitlistMemberEntity1.email,
        testWaitlistMemberEntity1.name,
        null,
        null,
        null,
        UserRoleEnum.User,
        testUserInvitesEntity1,
      );
      expect(em.persist).toHaveBeenCalledWith([testUserEntity1]);
    });

    it('should delete waitlist members and create users', async () => {
      await expect(
        service.deleteAndCreateUsers([testWaitlistMemberEntity1]),
      ).resolves.toEqual([testUserEntity1]);
      expect(em.persist).toHaveBeenCalledTimes(1);
      expect(solrCli.bulkDocRequest).toHaveBeenCalledTimes(1);
      expect(solrCli.bulkDocRequest).toHaveBeenCalledWith(solrAppCollection, {
        add: [new UserDocParams(testUserEntity1)],
        delete: [{ id: testWaitlistMemberEntity1.id }],
      });
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('rpInfo.origin', {
        infer: true,
      });
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(userService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(userService.sendVerificationEmail).toHaveBeenCalledWith([
        testUserEntity1,
      ]);
    });

    it('should throw BadRequestException if ORM throws a UniqueConstraintViolationException', async () => {
      jest.spyOn(em, 'persist').mockImplementation(() => {
        throw new UniqueConstraintViolationException(new Error('flush'));
      });
      await expect(
        service.deleteAndCreateUsers([testWaitlistMemberEntity1]),
      ).rejects.toThrow(new BadRequestException(userEmailTakenBadRequest));
    });

    it('should throw InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'persist').mockImplementation(() => {
        throw new Error('flush');
      });
      await expect(
        service.deleteAndCreateUsers([testWaitlistMemberEntity1]),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw InternalServerErrorException and undo changes if solr cli throws an error', async () => {
      jest
        .spyOn(solrCli, 'bulkDocRequest')
        .mockRejectedValue(new Error('bulkDocRequest'));
      await expect(
        service.deleteAndCreateUsers([testWaitlistMemberEntity1]),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.persist).toHaveBeenCalledTimes(2);
      expect(em.persist).toHaveBeenCalledWith([testWaitlistMemberEntity1]);
    });

    it('should throw InternalServerErrorException if mailer throws an error', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue(new Error('sendMail'));
      await expect(
        service.deleteAndCreateUsers([testWaitlistMemberEntity1]),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });
});
