import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberInviteService } from '@newbee/api/org-member-invite/data-access';
import {
  EntityService,
  testOrgMemberEntity1,
  testOrgMemberInviteEntity1,
  testOrganizationEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseTokenDto1,
  testCreateOrgMemberInviteDto1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { OrgMemberInviteController } from './org-member-invite.controller';

describe('OrgMemberInviteController', () => {
  let controller: OrgMemberInviteController;
  let service: OrgMemberInviteService;
  let entityService: EntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgMemberInviteController],
      providers: [
        {
          provide: OrgMemberInviteService,
          useValue: createMock<OrgMemberInviteService>({
            create: jest.fn().mockResolvedValue(testOrgMemberInviteEntity1),
            acceptInvite: jest.fn().mockResolvedValue(testOrgMemberEntity1),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createOrgMemberNoUser: jest
              .fn()
              .mockResolvedValue(testOrgMemberRelation1),
          }),
        },
      ],
    }).compile();

    controller = module.get<OrgMemberInviteController>(
      OrgMemberInviteController,
    );
    service = module.get<OrgMemberInviteService>(OrgMemberInviteService);
    entityService = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('invite', () => {
    it('should create a new org member invite', async () => {
      await expect(
        controller.invite(
          testCreateOrgMemberInviteDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1,
        ),
      ).resolves.toBeUndefined();
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        testOrgMemberInviteEntity1.userInvites.email,
        testOrgMemberInviteEntity1.role,
        testOrgMemberEntity1,
        testOrgMemberInviteEntity1.organization,
      );
    });
  });

  describe('accept', () => {
    it('should accept an org member invite', async () => {
      await expect(
        controller.accept(testBaseTokenDto1, testUserEntity1),
      ).resolves.toEqual(testOrgMemberRelation1);
      expect(service.acceptInvite).toHaveBeenCalledTimes(1);
      expect(service.acceptInvite).toHaveBeenCalledWith(
        testBaseTokenDto1.token,
        testUserEntity1,
      );
      expect(entityService.createOrgMemberNoUser).toHaveBeenCalledTimes(1);
      expect(entityService.createOrgMemberNoUser).toHaveBeenCalledWith(
        testOrgMemberEntity1,
      );
    });
  });

  describe('decline', () => {
    it('should decline an org member invite', async () => {
      await expect(
        controller.decline(testBaseTokenDto1, testUserEntity1),
      ).resolves.toBeUndefined();
      expect(service.declineInvite).toHaveBeenCalledTimes(1);
      expect(service.declineInvite).toHaveBeenCalledWith(
        testBaseTokenDto1.token,
        testUserEntity1,
      );
    });
  });
});
