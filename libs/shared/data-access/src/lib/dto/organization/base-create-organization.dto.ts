import type { Organization } from '@newbee/shared/util';

export class BaseCreateOrganizationDto implements Organization {
  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc
   */
  displayName: string | null = null;
}
