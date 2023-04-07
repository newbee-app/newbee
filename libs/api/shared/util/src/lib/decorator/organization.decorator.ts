import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * The decorator used to extract the `OrganizationEntity` appended to the request by the `OrgGuard`.
 * Used in the parameter of a controller function.
 */
export const Organization = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const organization = request.organization;
    return data ? organization?.[data] : organization;
  }
);
