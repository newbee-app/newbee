import { OrgRoleEnum, testUser1 } from '@newbee/shared/util';
import { inviteMemberFormToDto } from './invite-member-form-to-dto.function';

describe('inviteMemberFormToDto', () => {
  it('should convert an invite member form to a DTO', () => {
    expect(inviteMemberFormToDto({})).toEqual({
      email: '',
      role: OrgRoleEnum.Member,
    });
    expect(inviteMemberFormToDto({ email: null, role: null })).toEqual({
      email: '',
      role: OrgRoleEnum.Member,
    });
    expect(
      inviteMemberFormToDto({
        email: testUser1.email,
        role: OrgRoleEnum.Moderator,
      })
    ).toEqual({ email: testUser1.email, role: OrgRoleEnum.Moderator });
  });
});
