import type { Organization } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new organization.
 * Suitable for use in POST requests.
 */
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
