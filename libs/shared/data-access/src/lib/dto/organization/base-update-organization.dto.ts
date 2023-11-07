import type { Organization } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend for updating an organization's value.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateOrganizationDto implements Partial<Organization> {
  /**
   * @inheritdoc
   */
  name?: string;

  /**
   * @inheritdoc
   */
  slug?: string;

  /**
   * @inheritdoc
   */
  upToDateDuration?: string;
}
