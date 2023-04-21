import { OrgRoleEnum } from '../../enum';
import { compareOrgRoles } from './compare-org-roles.enum.function';

describe('compareOrgRoles', () => {
  it('should get comparison correct', () => {
    const member = OrgRoleEnum.Member;
    const moderator = OrgRoleEnum.Moderator;
    const owner = OrgRoleEnum.Owner;

    expect(compareOrgRoles(member, member)).toEqual(0);
    expect(compareOrgRoles(moderator, moderator)).toEqual(0);
    expect(compareOrgRoles(owner, owner)).toEqual(0);

    expect(compareOrgRoles(member, moderator)).toEqual(-1);
    expect(compareOrgRoles(member, owner)).toEqual(-1);
    expect(compareOrgRoles(moderator, owner)).toEqual(-1);

    expect(compareOrgRoles(moderator, member)).toEqual(1);
    expect(compareOrgRoles(owner, member)).toEqual(1);
    expect(compareOrgRoles(owner, moderator)).toEqual(1);
  });
});
