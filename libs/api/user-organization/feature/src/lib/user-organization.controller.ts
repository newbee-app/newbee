import { Controller } from '@nestjs/common';
import {
  userOrganization,
  userOrganizationVersion,
} from '@newbee/shared/data-access';

@Controller({ path: userOrganization, version: userOrganizationVersion })
export class UserOrganizationController {}
