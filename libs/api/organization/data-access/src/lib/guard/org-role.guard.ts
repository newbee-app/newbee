import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  organizationName,
  OrganizationRole,
  ORG_ROLE_KEY,
} from '@newbee/api/shared/util';
import { OrganizationService } from '../organization.service';

/**
 * A guard that pevents users from accessing endpoints annotated with org role metadata unless they possess the required role.
 */
@Injectable()
export class OrgRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly organizationService: OrganizationService,
    private readonly orgMemberService: OrgMemberService
  ) {}

  /**
   * Allows users to access a given route if:
   *
   * - The `ORG_ROLE_KEY` metadata key does not exist for the route.
   * - `organizationName` is not specified as a rotue parameter.
   * - Both of the above are specified and the user has one of the specified roles in the given organization.
   *
   * @param context The context of the request.
   * @returns `true` if roles aren't required or if the user has the requite role, `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<OrganizationRole[] | undefined>(
      ORG_ROLE_KEY,
      context.getHandler()
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { params, user } = request;
    const name: string | undefined = params[organizationName];
    if (!name) {
      return true;
    }

    try {
      const organization = await this.organizationService.findOneByName(name);
      const orgMember = await this.orgMemberService.findOneByUserAndOrg(
        user,
        organization
      );

      return roles.includes(orgMember.role);
    } catch (err) {
      return false;
    }
  }
}
