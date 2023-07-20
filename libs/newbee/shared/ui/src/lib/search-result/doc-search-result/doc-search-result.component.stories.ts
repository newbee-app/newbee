import { testDocRelation1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { DocSearchResultComponent } from './doc-search-result.component';

export default {
  title: 'DocSearchResultComponent',
  component: DocSearchResultComponent,
  args: { doc: testDocRelation1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<DocSearchResultComponent>;

type Story = StoryObj<DocSearchResultComponent>;

export const Primary: Story = {};
