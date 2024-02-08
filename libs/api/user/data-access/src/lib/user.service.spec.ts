import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  EntityService,
  OrgMemberEntity,
  UserEntity,
  testUserEntity1,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { shortenUuid } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  Keyword,
  internalServerError,
  testCreateUserDto1,
  testNow1,
  testPublicKeyCredentialCreationOptions1,
  testUpdateUserDto1,
  userEmailNotFound,
  userEmailTakenBadRequest,
  userIdNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { v4 } from 'uuid';
import type { UserAndOptions } from './interface';
import { UserService } from './user.service';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  generateRegistrationOptions: jest.fn(),
}));
const mockGenerateRegistrationOptions =
  generateRegistrationOptions as jest.Mock;

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  UserEntity: jest.fn(),
}));
const mockUserEntity = UserEntity as jest.Mock;

describe('UserService', () => {
  let service: UserService;
  let em: EntityManager;
  let entityService: EntityService;
  let userInvitesService: UserInvitesService;
  let mailerService: MailerService;
  let configService: ConfigService;

  const testUserEntity = createMock<UserEntity>({
    ...testUserEntity1,
    organizations: createMock<Collection<OrgMemberEntity>>(),
  });
  const testUpdatedUser = { ...testUserEntity, ...testUpdateUserDto1 };
  const testUserAndOptions: UserAndOptions = {
    user: testUserEntity,
    options: testPublicKeyCredentialCreationOptions1,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EntityManager,
          useValue: createMock<EntityRepository<UserEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testUserEntity),
            findOne: jest.fn().mockResolvedValue(testUserEntity),
            assign: jest.fn().mockReturnValue(testUpdatedUser),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
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
          provide: MailerService,
          useValue: createMock<MailerService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    userInvitesService = module.get<UserInvitesService>(UserInvitesService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
    mockGenerateRegistrationOptions.mockReturnValue(testUserAndOptions.options);
    mockV4.mockReturnValue(testUserEntity.id);
    mockUserEntity.mockReturnValue(testUserEntity);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userInvitesService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'sendVerificationEmail')
        .mockResolvedValue(testUserEntity);
    });

    afterEach(() => {
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledTimes(
        1,
      );
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledWith(
        testCreateUserDto1.email,
      );
      expect(mockGenerateRegistrationOptions).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testUserEntity);
    });

    it('should create a user', async () => {
      await expect(service.create(testCreateUserDto1)).resolves.toEqual(
        testUserAndOptions,
      );
      expect(service.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(service.sendVerificationEmail).toHaveBeenCalledWith(
        testUserEntity,
      );
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(service.create(testCreateUserDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(service.create(testCreateUserDto1)).rejects.toThrow(
        new BadRequestException(userEmailTakenBadRequest),
      );
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        UserEntity,
        testUserEntity.id,
      );
    });

    it('should get a single user by id', async () => {
      await expect(service.findOneById(testUserEntity.id)).resolves.toEqual(
        testUserEntity,
      );
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneById(testUserEntity.id)).rejects.toThrow(
        new NotFoundException(userIdNotFound),
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneById(testUserEntity.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(UserEntity, {
        email: testUserEntity.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity.email),
      ).resolves.toEqual(testUserEntity);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity.email),
      ).rejects.toThrow(new NotFoundException(userEmailNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneByEmailOrNull', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(UserEntity, {
        email: testUserEntity.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmailOrNull(testUserEntity.email),
      ).resolves.toEqual(testUserEntity);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByEmailOrNull(testUserEntity.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(
        testUserEntity,
        testUpdateUserDto1,
      );
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update the user', async () => {
      await expect(
        service.update(testUserEntity, testUpdateUserDto1),
      ).resolves.toEqual(testUpdatedUser);
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(em, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testUserEntity, testUpdateUserDto1),
      ).rejects.toThrow(new BadRequestException(userEmailTakenBadRequest));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testUserEntity, testUpdateUserDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(testUserEntity);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testUserEntity);
    });

    it('should delete the user', async () => {
      await expect(service.delete(testUserEntity)).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testUserEntity)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('sendVerificationEmail', () => {
    beforeEach(() => {
      jest.spyOn(configService, 'get').mockReturnValue('http://localhost:4200');
    });

    afterEach(() => {
      const verifyLink = `http://localhost:4200/${Keyword.User}/${
        Keyword.Verify
      }/${shortenUuid(testUserEntity.id)}`;
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: testUserEntity.email,
        subject: 'Verify your NewBee email',
        text: `You must verify your email to keep using NewBee. Please click the link below to verify: ${verifyLink}`,
        html: `<p>You must verify your email to keep using NewBee. Please click the link below to verify: <a href="${verifyLink}">${verifyLink}</a></p>`,
      });
    });

    it('should send email', async () => {
      await expect(
        service.sendVerificationEmail(testUserEntity),
      ).resolves.toEqual(testUpdatedUser);
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testUserEntity, {
        verifyEmailLastSentAt: testNow1,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if sendMail throws an error', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue(new Error('sendMail'));
      await expect(
        service.sendVerificationEmail(testUserEntity),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.sendVerificationEmail(testUserEntity),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('verifyEmail', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testUserEntity, {
        emailVerified: true,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should mark the user as having a verified email', async () => {
      await expect(service.verifyEmail(testUserEntity)).resolves.toEqual(
        testUpdatedUser,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue('flush');
      await expect(service.verifyEmail(testUserEntity)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });
});
