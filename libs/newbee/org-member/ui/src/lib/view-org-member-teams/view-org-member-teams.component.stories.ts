import {
  testTeamMemberRelation1,
  testTeamMemberRelation2,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ViewOrgMemberTeamsComponent } from './view-org-member-teams.component';

export default {
  title: 'ViewOrgMemberTeamsComponent',
  component: ViewOrgMemberTeamsComponent,
  args: {
    teams: [testTeamMemberRelation1, testTeamMemberRelation2],
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
  },
} as Meta<ViewOrgMemberTeamsComponent>;

type Story = StoryObj<ViewOrgMemberTeamsComponent>;

export const Primary: Story = {};

export const LotsOfTeams: Story = {
  args: {
    teams: [
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
      testTeamMemberRelation1,
    ],
  },
};
