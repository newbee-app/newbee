import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import {
  limitIsInt,
  limitMin1,
  offsetIsInt,
  offsetMin0,
  roleIsNotEmpty,
} from '../../constant';
import { OffsetAndLimit } from '../../interface';
import type { CreatorOrMaintainer } from '../../type';

/**
 * The DTO sent from the frontend to the backend to get an org member's posts.
 * Suitable for use in GET requests.
 */
export class GetOrgMemberPostsDto implements OffsetAndLimit {
  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: offsetIsInt })
  @Min(0, { message: offsetMin0 })
  readonly offset: number;

  /**
   * @inheritdoc
   */
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: limitIsInt })
  @Min(1, { message: limitMin1 })
  readonly limit: number;

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
    this.offset = offset;
    this.limit = limit;
    if (role) {
      this.role = role;
    }
  }
}
