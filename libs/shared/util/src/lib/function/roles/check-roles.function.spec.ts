import {
  ConditionalRoleEnum,
  OrgRoleEnum,
  PostRoleEnum,
  TeamRoleEnum,
  anyOrgMember,
  anyTeamMember,
  atLeastOrgModerator,
  atLeastTeamModerator,
} from '../../enum';
import { testOrgMember1 } from '../../example';
import { OrgMember } from '../../interface';
import { checkRoles } from './check-roles.function';

describe('checkRoles', () => {
  const orgMember: OrgMember = { role: OrgRoleEnum.Member, slug: 'bad' };
  const orgModerator: OrgMember = {
    role: OrgRoleEnum.Moderator,
    slug: 'bad',
  };

  it('should reject if all is falsy', () => {
    expect(checkRoles([], {})).toBeFalsy();
    expect(
      checkRoles(
        [
          anyOrgMember,
          anyTeamMember,
          PostRoleEnum.Creator,
          PostRoleEnum.Maintainer,
        ].flat(),
        {},
      ),
    ).toBeFalsy();
  });

  it('should check org roles', () => {
    expect(
      checkRoles(anyOrgMember, { orgMember: testOrgMember1 }),
    ).toBeTruthy();
    expect(checkRoles(anyOrgMember, { orgMember: orgModerator })).toBeTruthy();
    expect(checkRoles(anyOrgMember, { orgMember })).toBeTruthy();
    expect(
      checkRoles(atLeastOrgModerator, { orgMember: testOrgMember1 }),
    ).toBeTruthy();
    expect(
      checkRoles(atLeastOrgModerator, { orgMember: orgModerator }),
    ).toBeTruthy();
    expect(checkRoles(atLeastOrgModerator, { orgMember })).toBeFalsy();
    expect(
      checkRoles([OrgRoleEnum.Owner], { orgMember: testOrgMember1 }),
    ).toBeTruthy();
    expect(
      checkRoles([OrgRoleEnum.Owner], { orgMember: orgModerator }),
    ).toBeFalsy();
    expect(checkRoles([OrgRoleEnum.Owner], { orgMember })).toBeFalsy();
  });

  it('should check team roles', () => {
    expect(
      checkRoles(anyTeamMember, { teamRole: TeamRoleEnum.Owner }),
    ).toBeTruthy();
    expect(
      checkRoles(anyTeamMember, { teamRole: TeamRoleEnum.Moderator }),
    ).toBeTruthy();
    expect(
      checkRoles(anyTeamMember, { teamRole: TeamRoleEnum.Member }),
    ).toBeTruthy();
    expect(
      checkRoles(atLeastTeamModerator, { teamRole: TeamRoleEnum.Owner }),
    ).toBeTruthy();
    expect(
      checkRoles(atLeastTeamModerator, { teamRole: TeamRoleEnum.Moderator }),
    ).toBeTruthy();
    expect(
      checkRoles(atLeastTeamModerator, { teamRole: TeamRoleEnum.Member }),
    ).toBeFalsy();
    expect(
      checkRoles([TeamRoleEnum.Owner], { teamRole: TeamRoleEnum.Owner }),
    ).toBeTruthy();
    expect(
      checkRoles([TeamRoleEnum.Owner], { teamRole: TeamRoleEnum.Moderator }),
    ).toBeFalsy();
    expect(
      checkRoles([TeamRoleEnum.Owner], { teamRole: TeamRoleEnum.Member }),
    ).toBeFalsy();
  });

  it('should check post roles', () => {
    expect(
      checkRoles([PostRoleEnum.Creator], {
        orgMember: testOrgMember1,
        postCreator: testOrgMember1,
      }),
    ).toBeTruthy();
    expect(
      checkRoles([PostRoleEnum.Creator], {
        orgMember: orgModerator,
        postCreator: testOrgMember1,
      }),
    ).toBeFalsy();
    expect(
      checkRoles([PostRoleEnum.Maintainer], {
        orgMember: testOrgMember1,
        postMaintainer: testOrgMember1,
      }),
    ).toBeTruthy();
    expect(
      checkRoles([PostRoleEnum.Maintainer], {
        orgMember: orgModerator,
        postMaintainer: testOrgMember1,
      }),
    ).toBeFalsy();
  });

  it('should check conditional roles', () => {
    expect(
      checkRoles([ConditionalRoleEnum.OrgMemberIfNoTeam], { orgMember }),
    ).toBeTruthy();
    expect(
      checkRoles([ConditionalRoleEnum.OrgMemberIfNoTeam], {
        orgMember,
        team: true,
      }),
    ).toBeFalsy();
    expect(
      checkRoles(
        [ConditionalRoleEnum.OrgRoleGteSubject, atLeastOrgModerator].flat(),
        { orgMember: orgModerator, subjectOrgRole: OrgRoleEnum.Owner },
      ),
    ).toBeFalsy();
    expect(
      checkRoles(
        [ConditionalRoleEnum.OrgRoleGteSubject, atLeastOrgModerator].flat(),
        { orgMember: orgModerator, subjectOrgRole: OrgRoleEnum.Moderator },
      ),
    ).toBeTruthy();
    expect(
      checkRoles(
        [ConditionalRoleEnum.OrgRoleGteSubject, atLeastOrgModerator].flat(),
        { orgMember: orgModerator, subjectOrgRole: OrgRoleEnum.Member },
      ),
    ).toBeTruthy();
    expect(
      checkRoles(
        [ConditionalRoleEnum.TeamRoleGteSubject, atLeastTeamModerator].flat(),
        {
          teamRole: TeamRoleEnum.Moderator,
          subjectTeamRole: TeamRoleEnum.Owner,
        },
      ),
    ).toBeFalsy();
    expect(
      checkRoles(
        [ConditionalRoleEnum.TeamRoleGteSubject, atLeastTeamModerator].flat(),
        {
          teamRole: TeamRoleEnum.Moderator,
          subjectTeamRole: TeamRoleEnum.Moderator,
        },
      ),
    ).toBeTruthy();
    expect(
      checkRoles(
        [ConditionalRoleEnum.TeamRoleGteSubject, atLeastTeamModerator].flat(),
        {
          teamRole: TeamRoleEnum.Moderator,
          subjectTeamRole: TeamRoleEnum.Member,
        },
      ),
    ).toBeTruthy();
  });
});
