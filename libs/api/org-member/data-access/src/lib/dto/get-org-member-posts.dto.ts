import { OffsetAndLimitDto } from '@newbee/api/shared/data-access';
import {
  BaseGetOrgMemberPostsDto,
  CreatorOrMaintainer,
  roleIsNotEmpty,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to get an org member's posts.
 * Suitable for use in GET requests.
 */
export class GetOrgMemberPostsDto
  extends OffsetAndLimitDto
  implements BaseGetOrgMemberPostsDto
{
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: roleIsNotEmpty })
  readonly role?: CreatorOrMaintainer;
}
