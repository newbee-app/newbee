import { TeamRoleEnum, testTeam1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { TeamSearchResultComponent } from './team-search-result.component';

export default {
  title: 'TeamSearchResultComponent',
  component: TeamSearchResultComponent,
  args: {
    team: testTeam1,
    teamRole: TeamRoleEnum.Owner,
  },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<TeamSearchResultComponent>;

type Story = StoryObj<TeamSearchResultComponent>;

export const Primary: Story = {};

export const NoTeamRole: Story = { args: { teamRole: null } };
