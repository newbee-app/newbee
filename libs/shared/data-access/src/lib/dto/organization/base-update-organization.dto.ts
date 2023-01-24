import type { Organization } from '@newbee/shared/util';

export class BaseUpdateOrganizationDto implements Partial<Organization> {
  /**
   * @inheritdoc
   */
  name?: string;

  /**
   * @inheritdoc
   */
  displayName?: string | null;
}
