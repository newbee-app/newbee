import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  EntityService,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { testBaseUpdateOrgMemberDto1 } from '@newbee/shared/data-access';
import { testOrgMemberRelation1 } from '@newbee/shared/util';
import { OrgMemberController } from './org-member.controller';

describe('OrgMemberController', () => {
  let controller: OrgMemberController;
  let service: OrgMemberService;
  let entityService: EntityService;
  let userService: UserService;

  const testUpdatedOrgMember = {
    ...testOrgMemberEntity1,
    role: testBaseUpdateOrgMemberDto1.role,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgMemberController],
      providers: [
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            updateRole: jest.fn().mockResolvedValue(testUpdatedOrgMember),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createOrgMemberRelation: jest
              .fn()
              .mockResolvedValue(testOrgMemberRelation1),
          }),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        },
      ],
    }).compile();

    controller = module.get<OrgMemberController>(OrgMemberController);
    service = module.get<OrgMemberService>(OrgMemberService);
    entityService = module.get<EntityService>(EntityService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('getAndSelect', () => {
    it('should get and select the org member', async () => {
      await expect(
        controller.getAndSelect(
          testOrgMemberEntity1,
          testOrganizationEntity1,
          testUserEntity1
        )
      ).resolves.toEqual(testOrgMemberRelation1);
      expect(userService.update).toBeCalledTimes(1);
      expect(userService.update).toBeCalledWith(testUserEntity1, {
        selectedOrganization: testOrgMemberEntity1,
      });
      expect(entityService.createOrgMemberRelation).toBeCalledTimes(1);
      expect(entityService.createOrgMemberRelation).toBeCalledWith(
        testOrgMemberEntity1
      );
    });
  });

  describe('getBySlug', () => {
    it('should return an org member and its relations', async () => {
      await expect(
        controller.getBySlug(testOrgMemberEntity1, testOrganizationEntity1)
      ).resolves.toEqual(testOrgMemberRelation1);
      expect(entityService.createOrgMemberRelation).toBeCalledTimes(1);
      expect(entityService.createOrgMemberRelation).toBeCalledWith(
        testOrgMemberEntity1
      );
    });
  });

  describe('update', () => {
    it('should update an org member', async () => {
      await expect(
        controller.update(
          testBaseUpdateOrgMemberDto1,
          testOrgMemberEntity1,
          testOrgMemberEntity1,
          testOrganizationEntity1
        )
      ).resolves.toEqual(testOrgMemberRelation1);
      expect(service.updateRole).toBeCalledTimes(1);
      expect(service.updateRole).toBeCalledWith(
        testOrgMemberEntity1,
        testBaseUpdateOrgMemberDto1.role,
        testOrgMemberEntity1.role
      );
      expect(entityService.createOrgMemberRelation).toBeCalledTimes(1);
      expect(entityService.createOrgMemberRelation).toBeCalledWith(
        testUpdatedOrgMember
      );
    });
  });

  describe('delete', () => {
    it('should delete an org member', async () => {
      await expect(
        controller.delete(
          testOrgMemberEntity1,
          testOrgMemberEntity1,
          testOrganizationEntity1
        )
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(
        testOrgMemberEntity1,
        testOrgMemberEntity1.role
      );
    });
  });
});
