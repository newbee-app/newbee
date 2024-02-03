import type { CommonEntityFields, Organization } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new organization.
 * Suitable for use in POST requests.
 */
export class BaseCreateOrganizationDto
  implements Omit<Organization, keyof CommonEntityFields>
{
  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc
   */
  slug!: string;

  /**
   * @inheritdoc
   */
  upToDateDuration!: string;
}
