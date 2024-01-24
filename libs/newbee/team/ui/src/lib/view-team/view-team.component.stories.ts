import {
  OrgRoleEnum,
  TeamRoleEnum,
  defaultLimit,
  testDocQueryResult1,
  testOrganization1,
  testQnaQueryResult1,
  testTeam1,
  testTeamMember1,
  testTeamMemberRelation1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ViewTeamComponent } from './view-team.component';

export default {
  title: 'ViewTeamComponent',
  component: ViewTeamComponent,
  args: {
    organization: testOrganization1,
    team: {
      ...testTeamRelation1,
      teamMembers: [
        testTeamMemberRelation1,
        testTeamMemberRelation1,
        testTeamMemberRelation1,
        testTeamMemberRelation1,
        testTeamMemberRelation1,
      ],
      qnas: {
        results: [
          testQnaQueryResult1,
          testQnaQueryResult1,
          testQnaQueryResult1,
        ],
        total: 100,
        offset: 0,
        limit: defaultLimit,
      },
      docs: {
        results: [
          testDocQueryResult1,
          testDocQueryResult1,
          testDocQueryResult1,
        ],
        total: 100,
        offset: 0,
        limit: defaultLimit,
      },
    },
    teamMember: testTeamMember1,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
    teamNavigate: { action: 'teamNavigate' },
  },
} as Meta<ViewTeamComponent>;

type Story = StoryObj<ViewTeamComponent>;

export const Primary: Story = {};

export const OrgMember: Story = {
  args: {
    orgMember: { slug: 'bad', role: OrgRoleEnum.Member },
    teamMember: null,
  },
};

export const TeamMember: Story = {
  args: {
    orgMember: { slug: 'bad', role: OrgRoleEnum.Member },
    teamMember: { role: TeamRoleEnum.Member },
  },
};

export const LongTeamName: Story = {
  args: {
    team: {
      ...testTeamRelation1,
      team: {
        ...testTeam1,
        name: 'Really really really really really really really really long team name',
      },
    },
  },
};
