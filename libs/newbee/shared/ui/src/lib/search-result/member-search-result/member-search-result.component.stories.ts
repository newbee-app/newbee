import { SearchResultFormat } from '@newbee/newbee/shared/util';
import { TeamRoleEnum, testOrgMemberSearchResult1 } from '@newbee/shared/util';
import { Meta, StoryObj, componentWrapperDecorator } from '@storybook/angular';
import { MemberSearchResultComponent } from './member-search-result.component';

export default {
  title: 'Search Result/MemberSearchResultComponent',
  component: MemberSearchResultComponent,
  decorators: [
    componentWrapperDecorator((story) => `<div class="w-card">${story}</div>`),
  ],
  args: {
    format: SearchResultFormat.Card,
    orgMember: testOrgMemberSearchResult1,
    teamRole: TeamRoleEnum.Owner,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
  },
} as Meta<MemberSearchResultComponent>;

type Story = StoryObj<MemberSearchResultComponent>;

export const Card: Story = {};

export const CardNoTeamRole: Story = { args: { teamRole: null } };

export const List: Story = { args: { format: SearchResultFormat.List } };

export const ListNoTeamRole: Story = {
  args: { format: SearchResultFormat.List, teamRole: null },
};
