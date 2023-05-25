import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberInviteService } from '@newbee/api/org-member-invite/data-access';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testOrgMemberInviteEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateOrgMemberInviteDto1,
  testBaseTokenDto1,
} from '@newbee/shared/data-access';
import { OrgMemberInviteController } from './org-member-invite.controller';

describe('OrgMemberInviteController', () => {
  let controller: OrgMemberInviteController;
  let service: OrgMemberInviteService;

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
      ],
    }).compile();

    controller = module.get<OrgMemberInviteController>(
      OrgMemberInviteController
    );
    service = module.get<OrgMemberInviteService>(OrgMemberInviteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('invite', () => {
    it('should create a new org member invite', async () => {
      await expect(
        controller.invite(
          testBaseCreateOrgMemberInviteDto1,
          testOrgMemberEntity1,
          testOrganizationEntity1
        )
      ).resolves.toBeUndefined();
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testOrgMemberInviteEntity1.userInvites.email,
        testOrgMemberInviteEntity1.role,
        testOrgMemberEntity1,
        testOrgMemberInviteEntity1.organization
      );
    });
  });

  describe('accept', () => {
    it('should accept an org member invite', async () => {
      await expect(
        controller.accept(testBaseTokenDto1, testUserEntity1)
      ).resolves.toBeUndefined();
      expect(service.acceptInvite).toBeCalledTimes(1);
      expect(service.acceptInvite).toBeCalledWith(
        testBaseTokenDto1.token,
        testUserEntity1
      );
    });
  });

  describe('decline', () => {
    it('should decline an org member invite', async () => {
      await expect(
        controller.decline(testBaseTokenDto1, testUserEntity1)
      ).resolves.toBeUndefined();
      expect(service.declineInvite).toBeCalledTimes(1);
      expect(service.declineInvite).toBeCalledWith(
        testBaseTokenDto1.token,
        testUserEntity1
      );
    });
  });
});
