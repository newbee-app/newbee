import { TeamRoleEnum, testOrgMemberQueryResult1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { MemberSearchResultComponent } from './member-search-result.component';

export default {
  title: 'Search Result/MemberSearchResultComponent',
  component: MemberSearchResultComponent,
  args: {
    format: 'card',
    orgMember: testOrgMemberQueryResult1,
    teamRole: TeamRoleEnum.Owner,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
  },
} as Meta<MemberSearchResultComponent>;

type Story = StoryObj<MemberSearchResultComponent>;

export const Card: Story = {};

export const CardNoTeamRole: Story = { args: { teamRole: null } };

export const List: Story = { args: { format: 'list' } };

export const ListNoTeamRole: Story = {
  args: { format: 'list', teamRole: null },
};
