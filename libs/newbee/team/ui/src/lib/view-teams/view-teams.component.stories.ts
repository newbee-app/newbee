import { testOrgMember1, testTeam1, testTeam2 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ViewTeamsComponent } from './view-teams.component';

export default {
  title: 'ViewTeamsComponent',
  component: ViewTeamsComponent,
  args: {
    teams: [testTeam1, testTeam2],
    orgMember: testOrgMember1,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
  },
} as Meta<ViewTeamsComponent>;

type Story = StoryObj<ViewTeamsComponent>;

export const Primary: Story = {};

export const LotsOfTeams: Story = {
  args: {
    teams: [
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
      testTeam1,
    ],
  },
};
