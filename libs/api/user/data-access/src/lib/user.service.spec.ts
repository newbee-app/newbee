import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  QueryOrder,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  EntityService,
  OrgMemberEntity,
  UserDocParams,
  UserEntity,
  testOrgMemberDocParams1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testUserEntity1,
  testUserEntity2,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { solrAppCollection } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  UserRoleEnum,
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
  let txEm: EntityManager;
  let solrCli: SolrCli;
  let configService: ConfigService;
  let mailerService: MailerService;
  let entityService: EntityService;
  let userInvitesService: UserInvitesService;

  const testUserAndOptions: UserAndOptions = {
    user: testUserEntity1,
    options: testPublicKeyCredentialCreationOptions1,
  };

  beforeEach(async () => {
    txEm = createMock<EntityManager>({
      assign: jest.fn().mockReturnValue(testUserEntity1),
    });

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testUserEntity1),
            findAndCount: jest
              .fn()
              .mockResolvedValue([[testUserEntity1, testUserEntity2], 2]),
            assign: jest.fn().mockReturnValue(testUserEntity1),
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
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockReturnValue('http://localhost:4200'),
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
      ],
    }).compile();

    service = module.get(UserService);
    em = module.get(EntityManager);
    solrCli = module.get(SolrCli);
    configService = module.get(ConfigService);
    entityService = module.get(EntityService);
    userInvitesService = module.get(UserInvitesService);
    mailerService = module.get(MailerService);

    jest.clearAllMocks();
    mockGenerateRegistrationOptions.mockResolvedValue(
      testUserAndOptions.options,
    );
    mockV4.mockReturnValue(testUserEntity1.id);
    mockUserEntity.mockReturnValue(testUserEntity1);
    testUserEntity1.organizations = createMock<Collection<OrgMemberEntity>>({
      getItems: jest.fn().mockReturnValue([testOrgMemberEntity1]),
    });

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(txEm).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(configService).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userInvitesService).toBeDefined();
    expect(mailerService).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'sendVerificationEmail')
        .mockResolvedValue([testUserEntity1]);
    });

    afterEach(() => {
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledTimes(
        1,
      );
      expect(userInvitesService.findOrCreateOneByEmail).toHaveBeenCalledWith(
        testCreateUserDto1.email,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('rpInfo', { infer: true });
      expect(mockGenerateRegistrationOptions).toHaveBeenCalledTimes(1);
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
      expect(txEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.persistAndFlush).toHaveBeenCalledWith(testUserEntity1);
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(txEm, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(service.create(testCreateUserDto1)).rejects.toThrow(
        new BadRequestException(userEmailTakenBadRequest),
      );
    });

    describe('succeeds', () => {
      afterEach(() => {
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

      it('should create a user', async () => {
        await expect(service.create(testCreateUserDto1)).resolves.toEqual(
          testUserAndOptions,
        );
      });

      it('should continue if sendVerificationEmail throws', async () => {
        jest
          .spyOn(service, 'sendVerificationEmail')
          .mockRejectedValue(new Error('sendVerificationEmail'));
        await expect(service.create(testCreateUserDto1)).resolves.toEqual(
          testUserAndOptions,
        );
      });
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(UserEntity, testUserEntity1.id);
    });

    it('should get a single user by id', async () => {
      await expect(service.findOneById(testUserEntity1.id)).resolves.toEqual(
        testUserEntity1,
      );
    });

    it('should throw a NotFoundException if user cannot be found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(service.findOneById(testUserEntity1.id)).rejects.toThrow(
        new NotFoundException(userIdNotFound),
      );
    });
  });

  describe('findOneByIdOrNull', () => {
    it('should get a single user by id', async () => {
      await expect(
        service.findOneByIdOrNull(testUserEntity1.id),
      ).resolves.toEqual(testUserEntity1);
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(UserEntity, testUserEntity1.id);
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(UserEntity, {
        email: testUserEntity1.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).resolves.toEqual(testUserEntity1);
    });

    it('should throw a NotFoundException if user cannot be found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).rejects.toThrow(new NotFoundException(userEmailNotFound));
    });
  });

  describe('findOneByEmailOrNull', () => {
    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmailOrNull(testUserEntity1.email),
      ).resolves.toEqual(testUserEntity1);
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(UserEntity, {
        email: testUserEntity1.email,
      });
    });
  });

  describe('getAllAndCount', () => {
    it('should get users and count', async () => {
      await expect(
        service.getAllAndCount(testOffsetAndLimit1),
      ).resolves.toEqual([[testUserEntity1, testUserEntity2], 2]);
      expect(em.findAndCount).toHaveBeenCalledTimes(1);
      expect(em.findAndCount).toHaveBeenCalledWith(
        UserEntity,
        {},
        { ...testOffsetAndLimit1, orderBy: { role: QueryOrder.DESC } },
      );
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledWith(
        testUserEntity1,
        testUpdateUserDto1,
      );
      expect(txEm.flush).toHaveBeenCalledTimes(1);
    });

    it('should update the user', async () => {
      await expect(
        service.update(testUserEntity1, testUpdateUserDto1),
      ).resolves.toEqual(testUserEntity1);
      expect(txEm.populate).toHaveBeenCalledTimes(1);
      expect(txEm.populate).toHaveBeenCalledWith(testUserEntity1, [
        'organizations',
      ]);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(2);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        solrAppCollection,
        new UserDocParams(testUserEntity1),
      );
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrgMemberEntity1.organization.id,
        testOrgMemberDocParams1,
      );
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(txEm, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testUserEntity1, testUpdateUserDto1),
      ).rejects.toThrow(new BadRequestException(userEmailTakenBadRequest));
    });
  });

  describe('delete', () => {
    it('should delete the user', async () => {
      await expect(service.delete(testUserEntity1)).resolves.toBeUndefined();
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(testUserEntity1);
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.populate).toHaveBeenCalledTimes(1);
      expect(txEm.populate).toHaveBeenCalledWith(testUserEntity1, [
        'organizations',
      ]);
      expect(txEm.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledWith(testUserEntity1);
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(2);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(solrAppCollection, {
        id: testUserEntity1.id,
      });
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        { id: testOrgMemberEntity1.id },
      );
    });
  });

  describe('sendVerificationEmail', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testUserEntity1, {
        verifyEmailLastSentAt: testNow1,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should send email for single user', async () => {
      await expect(
        service.sendVerificationEmail(testUserEntity1),
      ).resolves.toEqual([testUserEntity1]);
      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should continue on if mailer throws an error', async () => {
      jest
        .spyOn(mailerService, 'sendMail')
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('sendMail'));
      await expect(
        service.sendVerificationEmail([testUserEntity1, testUserEntity2]),
      ).resolves.toEqual([testUserEntity1]);
      expect(mailerService.sendMail).toHaveBeenCalledTimes(2);
    });
  });

  describe('verifyEmail', () => {
    it('should mark the user as having a verified email', async () => {
      await expect(service.verifyEmail(testUserEntity1)).resolves.toEqual(
        testUserEntity1,
      );
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testUserEntity1, {
        emailVerified: true,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });
  });
});
