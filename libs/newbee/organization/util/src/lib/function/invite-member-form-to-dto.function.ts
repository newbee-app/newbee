import { BaseCreateOrgMemberInviteDto } from '@newbee/shared/data-access';
import { OrgRoleEnum } from '@newbee/shared/util';
import type { InviteMemberForm } from '../interface';

/**
 * Converts an InviteMemberForm to a BaseCreateOrgMemberInviteDto.
 *
 * @param inviteMemberForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function inviteMemberFormToDto(
  inviteMemberForm: InviteMemberForm | Partial<InviteMemberForm>
): BaseCreateOrgMemberInviteDto {
  const { email, role } = inviteMemberForm;
  return { email: email ?? '', role: role ?? OrgRoleEnum.Member };
}
