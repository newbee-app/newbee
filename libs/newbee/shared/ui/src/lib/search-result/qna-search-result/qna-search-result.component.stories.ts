import { testQnaRelation1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { QnaSearchResultComponent } from './qna-search-result.component';

export default {
  title: 'QnaSearchResultComponent',
  component: QnaSearchResultComponent,
  args: { qna: testQnaRelation1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<QnaSearchResultComponent>;

type Story = StoryObj<QnaSearchResultComponent>;

export const Primary: Story = {};
