import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  NotFoundError,
  QueryOrder,
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
  UserDocParams,
  UserEntity,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testUserEntity1,
  testUserEntity2,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { shortenUuid, solrAppCollection } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  Keyword,
  UserRoleEnum,
  internalServerError,
  testCreateUserDto1,
  testNow1,
  testOffsetAndLimit1,
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
  let solrCli: SolrCli;
  let configService: ConfigService;
  let entityService: EntityService;
  let userInvitesService: UserInvitesService;
  let mailerService: MailerService;

  const testUpdatedUser = { ...testUserEntity1, ...testUpdateUserDto1 };
  const testUserAndOptions: UserAndOptions = {
    user: testUserEntity1,
    options: testPublicKeyCredentialCreationOptions1,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EntityManager,
          useValue: createMock<EntityRepository<UserEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testUserEntity1),
            findOne: jest.fn().mockResolvedValue(testUserEntity1),
            findAndCount: jest
              .fn()
              .mockResolvedValue([[testUserEntity1, testUserEntity2], 2]),
            assign: jest.fn().mockReturnValue(testUpdatedUser),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
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
      ],
    }).compile();

    service = module.get(UserService);
    em = module.get(EntityManager);
    solrCli = module.get(SolrCli);
    configService = module.get(ConfigService);
    entityService = module.get(EntityService);
    userInvitesService = module.get(UserInvitesService);
    mailerService = module.get(MailerService);

    testUserEntity1.organizations = createMock<Collection<OrgMemberEntity>>({
      getItems: jest.fn().mockReturnValue([testOrgMemberEntity1]),
    });

    jest.clearAllMocks();
    mockGenerateRegistrationOptions.mockResolvedValue(
      testUserAndOptions.options,
    );
    mockV4.mockReturnValue(testUserEntity1.id);
    mockUserEntity.mockReturnValue(testUserEntity1);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(configService).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userInvitesService).toBeDefined();
    expect(mailerService).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(service, 'sendVerificationEmail').mockResolvedValue(undefined);
    });

    afterEach(() => {
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('rpInfo', { infer: true });
      expect(mockGenerateRegistrationOptions).toHaveBeenCalledTimes(1);
    });

    it('should create a user', async () => {
      await expect(service.create(testCreateUserDto1)).resolves.toEqual(
        testUserAndOptions,
      );
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledTimes(
        1,
      );
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledWith(
        testCreateUserDto1.email,
      );
      expect(mockUserEntity).toHaveBeenCalledTimes(1);
      expect(mockUserEntity).toHaveBeenCalledWith(
        testUserEntity1.id,
        testCreateUserDto1.email,
        testCreateUserDto1.name,
        testCreateUserDto1.displayName,
        testCreateUserDto1.phoneNumber,
        testUserAndOptions.options.challenge,
        UserRoleEnum.User,
        testUserInvitesEntity1,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testUserEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        solrAppCollection,
        new UserDocParams(testUserEntity1),
      );
      expect(service.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(service.sendVerificationEmail).toHaveBeenCalledWith(
        testUserEntity1,
      );
    });

    it('should throw an InternalServerErrorException if generateRegistrationOptions throws an error', async () => {
      mockGenerateRegistrationOptions.mockRejectedValue(
        new Error('generateRegistrationOptions'),
      );
      await expect(service.create(testCreateUserDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
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

    it('should throw an InternalServerErrorException and delete user if solr cli throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(service.create(testCreateUserDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testUserEntity1);
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        UserEntity,
        testUserEntity1.id,
      );
    });

    it('should get a single user by id', async () => {
      await expect(service.findOneById(testUserEntity1.id)).resolves.toEqual(
        testUserEntity1,
      );
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneById(testUserEntity1.id)).rejects.toThrow(
        new NotFoundException(userIdNotFound),
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneById(testUserEntity1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(UserEntity, {
        email: testUserEntity1.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).resolves.toEqual(testUserEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).rejects.toThrow(new NotFoundException(userEmailNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneByEmailOrNull', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(UserEntity, {
        email: testUserEntity1.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmailOrNull(testUserEntity1.email),
      ).resolves.toEqual(testUserEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByEmailOrNull(testUserEntity1.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('getAllAndCount', () => {
    afterEach(() => {
      expect(em.findAndCount).toHaveBeenCalledTimes(1);
      expect(em.findAndCount).toHaveBeenCalledWith(
        UserEntity,
        {},
        { ...testOffsetAndLimit1, orderBy: { role: QueryOrder.DESC } },
      );
    });

    it('should get users and count', async () => {
      await expect(
        service.getAllAndCount(testOffsetAndLimit1),
      ).resolves.toEqual([[testUserEntity1, testUserEntity2], 2]);
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

  describe('update', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(
        testUserEntity1,
        testUpdateUserDto1,
      );
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update the user', async () => {
      await expect(
        service.update(testUserEntity1, testUpdateUserDto1),
      ).resolves.toEqual(testUpdatedUser);
      expect(em.populate).toHaveBeenCalledTimes(1);
      expect(em.populate).toHaveBeenCalledWith(testUpdatedUser, [
        'organizations',
      ]);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        solrAppCollection,
        new UserDocParams(testUpdatedUser),
      );
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(em, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testUserEntity1, testUpdateUserDto1),
      ).rejects.toThrow(new BadRequestException(userEmailTakenBadRequest));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testUserEntity1, testUpdateUserDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(testUserEntity1);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testUserEntity1);
    });

    it('should delete the user', async () => {
      await expect(service.delete(testUserEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(2);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(solrAppCollection, {
        id: testUserEntity1.id,
      });
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        { id: testOrgMemberEntity1.id },
      );
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testUserEntity1)).rejects.toThrow(
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
      }/${shortenUuid(testUserEntity1.id)}`;
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: testUserEntity1.email,
        subject: 'Verify your NewBee email',
        text: `You must verify your email to keep using NewBee. Please click the link below to verify: ${verifyLink}`,
        html: `<p>You must verify your email to keep using NewBee. Please click the link below to verify: <a href="${verifyLink}">${verifyLink}</a></p>`,
      });
    });

    it('should send email for single user', async () => {
      await expect(
        service.sendVerificationEmail(testUserEntity1),
      ).resolves.toBeUndefined();
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testUserEntity1, {
        verifyEmailLastSentAt: testNow1,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should send emails for users array', async () => {
      await expect(
        service.sendVerificationEmail([testUserEntity1]),
      ).resolves.toBeUndefined();
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testUserEntity1, {
        verifyEmailLastSentAt: testNow1,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if sendMail throws an error', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue(new Error('sendMail'));
      await expect(
        service.sendVerificationEmail(testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.sendVerificationEmail(testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('verifyEmail', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testUserEntity1, {
        emailVerified: true,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should mark the user as having a verified email', async () => {
      await expect(service.verifyEmail(testUserEntity1)).resolves.toEqual(
        testUpdatedUser,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue('flush');
      await expect(service.verifyEmail(testUserEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });
});
