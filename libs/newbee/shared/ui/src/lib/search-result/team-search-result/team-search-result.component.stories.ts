import { TeamRoleEnum, testTeamQueryResult1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { TeamSearchResultComponent } from './team-search-result.component';

export default {
  title: 'Search Result/TeamSearchResultComponent',
  component: TeamSearchResultComponent,
  args: {
    format: 'card',
    team: testTeamQueryResult1,
    teamRole: TeamRoleEnum.Owner,
  },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<TeamSearchResultComponent>;

type Story = StoryObj<TeamSearchResultComponent>;

export const Card: Story = {};

export const CardNoTeamRole: Story = { args: { teamRole: null } };

export const List: Story = { args: { format: 'list' } };

export const ListNoTeamRole: Story = {
  args: { format: 'list', teamRole: null },
};
