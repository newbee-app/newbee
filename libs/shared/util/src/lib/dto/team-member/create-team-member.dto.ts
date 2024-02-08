import { IsEnum, IsNotEmpty } from 'class-validator';
import { slugIsNotEmpty, teamRoleIsEnum } from '../../constant';
import { TeamRoleEnum } from '../../enum';
import type { CommonEntityFields, TeamMember } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new team member.
 * Suitable for use in POST requests.
 */
export class CreateTeamMemberDto
  implements Omit<TeamMember, keyof CommonEntityFields>
{
  /**
   * @inheritdoc
   */
  @IsEnum(TeamRoleEnum, { message: teamRoleIsEnum })
  readonly role: TeamRoleEnum;

  /**
   * The slug of the org member to turn into a team member.
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  readonly orgMemberSlug: string;

  constructor(role: TeamRoleEnum, orgMemberSlug: string) {
    this.role = role;
    this.orgMemberSlug = orgMemberSlug;
  }
}
