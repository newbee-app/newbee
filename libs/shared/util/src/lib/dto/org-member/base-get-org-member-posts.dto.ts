import { defaultLimit } from '../../constant';
import { OffsetAndLimit } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to get an org member's posts.
 * Suitable for use in GET requests.
 */
export class BaseGetOrgMemberPostsDto implements OffsetAndLimit {
  /**
   * @inheritdoc
   */
  readonly offset: number = 0;

  /**
   * @inheritdoc
   */
  readonly limit: number = defaultLimit;

  /**
   * The role the org member should have in the fetched posts.
   */
  readonly role!: 'creator' | 'maintainer';
}
