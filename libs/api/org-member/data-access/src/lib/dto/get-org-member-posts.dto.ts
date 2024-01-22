import { OffsetAndLimitDto } from '@newbee/api/shared/data-access';
import { BaseGetOrgMemberPostsDto, roleIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

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
  @IsNotEmpty({ message: roleIsNotEmpty })
  readonly role!: 'creator' | 'maintainer';
}
