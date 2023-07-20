import { testOrgMemberRelation1, testPost1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { SearchResultHeaderComponent } from './search-result-header.component';

export default {
  title: 'SearchResultHeaderComponent',
  component: SearchResultHeaderComponent,
  args: { post: testPost1, maintainer: testOrgMemberRelation1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<SearchResultHeaderComponent>;

type Story = StoryObj<SearchResultHeaderComponent>;

export const Primary: Story = {};
