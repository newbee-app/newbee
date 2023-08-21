import { TeamRoleEnum, testOrgMemberRelation1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { MemberSearchResultComponent } from './member-search-result.component';

export default {
  title: 'MemberSearchResultComponent',
  component: MemberSearchResultComponent,
  args: {
    orgMember: testOrgMemberRelation1,
    teamRole: TeamRoleEnum.Owner,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
  },
} as Meta<MemberSearchResultComponent>;

type Story = StoryObj<MemberSearchResultComponent>;

export const Primary: Story = {};

export const NoTeamRole: Story = { args: { teamRole: null } };
