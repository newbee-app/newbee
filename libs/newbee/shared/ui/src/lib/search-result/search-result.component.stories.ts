import {
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testQnaSearchResult1,
  testTeamSearchResult1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { SearchResultComponent } from './search-result.component';

export default {
  title: 'Search Result/SearchResultComponent',
  component: SearchResultComponent,
  args: { searchResult: testOrgMemberSearchResult1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<SearchResultComponent>;

type Story = StoryObj<SearchResultComponent>;

export const OrgMember: Story = {};

export const Team: Story = { args: { searchResult: testTeamSearchResult1 } };

export const Doc: Story = { args: { searchResult: testDocSearchResult1 } };

export const Qna: Story = { args: { searchResult: testQnaSearchResult1 } };
