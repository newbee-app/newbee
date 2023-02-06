import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { OrganizationRole, ORG_ROLE_KEY } from '@newbee/api/shared/util';
import { OrganizationService } from '../organization.service';
import { OrgRoleGuard } from './org-role.guard';

describe('OrgRoleGuard', () => {
  let guard: OrgRoleGuard;
  let reflector: Reflector;
  let organizationService: OrganizationService;
  let orgMemberService: OrgMemberService;
  let context: ExecutionContext;

  beforeEach(() => {
    orgMemberService = createMock<OrgMemberService>({
      findOneByUserAndOrg: jest.fn().mockResolvedValue(testOrgMemberEntity1),
    });
    organizationService = createMock<OrganizationService>({
      findOneByName: jest.fn().mockResolvedValue(testOrganizationEntity1),
    });
    reflector = createMock<Reflector>({
      get: jest.fn().mockReturnValue([OrganizationRole.Owner]),
    });
    guard = new OrgRoleGuard(reflector, organizationService, orgMemberService);
    context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue(
        createMock<HttpArgumentsHost>({
          getRequest: jest.fn().mockReturnValue({
            params: {
              organizationName: testOrganizationEntity1.name,
            },
            user: testUserEntity1,
          }),
        })
      ),
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(reflector).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('calls reflector', () => {
    afterEach(() => {
      expect(reflector.get).toBeCalledTimes(1);
      expect(reflector.get).toBeCalledWith(ORG_ROLE_KEY, context.getHandler());
    });

    it('should return true if org roles were never specified', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });

    it('should return true if organizationName is not a route parameter', async () => {
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ params: {}, user: testUserEntity1 });
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });

    describe('calls organizationService', () => {
      afterEach(() => {
        expect(organizationService.findOneByName).toBeCalledTimes(1);
        expect(organizationService.findOneByName).toBeCalledWith(
          testOrganizationEntity1.name
        );
      });

      it('should return false if organization does not exist', async () => {
        jest
          .spyOn(organizationService, 'findOneByName')
          .mockRejectedValue(new Error('findOneByName'));
        await expect(guard.canActivate(context)).resolves.toBeFalsy();
        expect(organizationService.findOneByName).toBeCalledTimes(1);
        expect(organizationService.findOneByName).toBeCalledWith(
          testOrganizationEntity1.name
        );
      });

      describe('calls orgMemberService', () => {
        afterEach(() => {
          expect(orgMemberService.findOneByUserAndOrg).toBeCalledTimes(1);
          expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
            testUserEntity1,
            testOrganizationEntity1
          );
        });

        it('should return true if org member has required role', async () => {
          await expect(guard.canActivate(context)).resolves.toBeTruthy();
        });

        it('should return false if org member does not exist', async () => {
          jest
            .spyOn(orgMemberService, 'findOneByUserAndOrg')
            .mockRejectedValue(new Error('findOneByUserAndOrg'));
          await expect(guard.canActivate(context)).resolves.toBeFalsy();
        });

        it('should return false if org member does not have the required role', async () => {
          jest
            .spyOn(orgMemberService, 'findOneByUserAndOrg')
            .mockResolvedValue({
              ...testOrgMemberEntity1,
              role: OrganizationRole.Member,
            });
          await expect(guard.canActivate(context)).resolves.toBeFalsy();
        });
      });
    });
  });
});
