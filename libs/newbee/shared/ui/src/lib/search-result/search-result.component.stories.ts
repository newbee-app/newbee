import {
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testTeamQueryResult1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { SearchResultComponent } from './search-result.component';

export default {
  title: 'Search Result/SearchResultComponent',
  component: SearchResultComponent,
  args: { searchResult: testOrgMemberQueryResult1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<SearchResultComponent>;

type Story = StoryObj<SearchResultComponent>;

export const OrgMember: Story = {};

export const Team: Story = { args: { searchResult: testTeamQueryResult1 } };

export const Doc: Story = { args: { searchResult: testDocQueryResult1 } };

export const Qna: Story = { args: { searchResult: testQnaQueryResult1 } };
