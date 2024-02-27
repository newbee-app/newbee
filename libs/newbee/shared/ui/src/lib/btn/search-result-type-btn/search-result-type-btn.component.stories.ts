import {
  testDocSearchResult1,
  testOrgMemberSearchResult1,
  testQnaSearchResult1,
  testTeamSearchResult1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { SearchResultTypeBtnComponent } from './search-result-type-btn.component';

export default {
  title: 'Btn/SearchResultTypeBtnComponent',
  component: SearchResultTypeBtnComponent,
  parameters: { layout: 'centered' },
  args: { searchResult: testOrgMemberSearchResult1 },
} as Meta<SearchResultTypeBtnComponent>;

type Story = StoryObj<SearchResultTypeBtnComponent>;

export const OrgMember: Story = {};

export const Team: Story = { args: { searchResult: testTeamSearchResult1 } };

export const Doc: Story = { args: { searchResult: testDocSearchResult1 } };

export const Qna: Story = { args: { searchResult: testQnaSearchResult1 } };
