import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { organization } from '@newbee/shared/data-access';

/**
 * The decorator used to extract the `OrganizationEntity` appended to the request by the `OrgGuard`.
 * Used in the parameter of a controller function.
 */
export const Organization = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const org = request[organization];
    return data ? org?.[data] : org;
  }
);
