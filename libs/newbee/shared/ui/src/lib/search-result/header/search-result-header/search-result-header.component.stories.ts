import {
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testTeamQueryResult1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { SearchResultHeaderComponent } from './search-result-header.component';

export default {
  title: 'Search Result/Header/SearchResultHeaderComponent',
  component: SearchResultHeaderComponent,
  args: { searchResult: testOrgMemberQueryResult1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<SearchResultHeaderComponent>;

type Story = StoryObj<SearchResultHeaderComponent>;

export const OrgMember: Story = {};

export const Team: Story = { args: { searchResult: testTeamQueryResult1 } };

export const Doc: Story = { args: { searchResult: testDocQueryResult1 } };

export const Qna: Story = { args: { searchResult: testQnaQueryResult1 } };
