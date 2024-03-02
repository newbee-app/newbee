import { IsNotEmpty, IsOptional } from 'class-validator';
import { roleIsNotEmpty } from '../../constant';
import type { CreatorOrMaintainer } from '../../type';
import { OffsetAndLimitDto } from '../shared';

/**
 * The DTO sent from the frontend to the backend to get an org member's posts.
 * Suitable for use in GET requests.
 */
export class GetOrgMemberPostsDto extends OffsetAndLimitDto {
  /**
   * The role the org member should have in the fetched posts.
   * Don't specify to search across all creators and maintainers.
   * Needs to be a partial instead of a nullable because it will be used in GET requests.
   */
  @IsOptional()
  @IsNotEmpty({ message: roleIsNotEmpty })
  readonly role?: CreatorOrMaintainer;

  constructor(
    offset: number,
    limit: number,
    role?: CreatorOrMaintainer | null | undefined,
  ) {
    super(offset, limit);
    if (role) {
      this.role = role;
    }
  }
}
