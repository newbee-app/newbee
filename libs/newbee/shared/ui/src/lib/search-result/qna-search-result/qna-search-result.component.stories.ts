import { testPost1, testQnaQueryResult1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { QnaSearchResultComponent } from './qna-search-result.component';

export default {
  title: 'Search Result/QnaSearchResultComponent',
  component: QnaSearchResultComponent,
  args: { qna: testQnaQueryResult1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<QnaSearchResultComponent>;

type Story = StoryObj<QnaSearchResultComponent>;

export const Primary: Story = {};

export const NoAnswer: Story = {
  args: {
    qna: {
      ...testQnaQueryResult1,
      qna: { ...testPost1, questionSnippet: null, answerSnippet: null },
    },
  },
};
