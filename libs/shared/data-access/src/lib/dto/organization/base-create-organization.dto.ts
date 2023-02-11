import type { Organization } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new organization.
 * Suitable for use in POST requests.
 */
export class BaseCreateOrganizationDto
  implements Omit<Organization, 'slug'>, Partial<Pick<Organization, 'slug'>>
{
  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc Leave undefined to auto-generate the slug.
   */
  slug?: string;
}
