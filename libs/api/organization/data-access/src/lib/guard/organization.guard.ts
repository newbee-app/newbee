import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { organization } from '@newbee/shared/data-access';
import { organizationSlugNotSpecifiedBadRequest } from '@newbee/shared/util';
import { OrganizationService } from '../organization.service';

/**
 * A guard that prevents users from accessing endpoints that don't specify a valid organization slug in its params.
 * If a valid organization can be found from the slug, it is attached to the request.
 */
@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * Allows users to access a given route if it specifies a valid organization slug in its params.
   * If a valid organization can be found from the slug, it is attached to the request.
   *
   * @param context The context of the request.
   *
   * @returns `true` if an organization slug was found and successfully attached to the request, throws an exception otherwise.
   * @throws {BadRequestException} `organizationSlugNotSpecifiedBadRequest`if an organization slug was not specified.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the service throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the service throws any other type of error.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const orgSlug = params[organization];
    if (!orgSlug) {
      throw new BadRequestException(organizationSlugNotSpecifiedBadRequest);
    }

    const org = await this.organizationService.findOneBySlug(orgSlug);
    request.org = org;
    return true;
  }
}
