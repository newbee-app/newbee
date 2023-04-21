import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { organizationKey } from '../constant';

/**
 * The decorator used to extract the `OrganizationEntity` appended to the request by the `RoleGuard`.
 * Used in the parameter of a controller function.
 */
export const Organization = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const organization = request[organizationKey];
    return data ? organization?.[data] : organization;
  }
);
