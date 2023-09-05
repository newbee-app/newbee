import {
  testDocQueryResult1,
  testOrgMemberQueryResult1,
  testQnaQueryResult1,
  testTeamQueryResult1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { SearchResultTypeBtnComponent } from './search-result-type-btn.component';

export default {
  title: 'Btn/SearchResultTypeBtnComponent',
  component: SearchResultTypeBtnComponent,
  parameters: { layout: 'centered' },
  args: { searchResult: testOrgMemberQueryResult1 },
} as Meta<SearchResultTypeBtnComponent>;

type Story = StoryObj<SearchResultTypeBtnComponent>;

export const OrgMember: Story = {};

export const Team: Story = { args: { searchResult: testTeamQueryResult1 } };

export const Doc: Story = { args: { searchResult: testDocQueryResult1 } };

export const Qna: Story = { args: { searchResult: testQnaQueryResult1 } };
