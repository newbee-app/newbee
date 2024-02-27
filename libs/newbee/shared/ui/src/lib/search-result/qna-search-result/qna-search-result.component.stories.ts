import { testPost1, testQnaSearchResult1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { QnaSearchResultComponent } from './qna-search-result.component';

export default {
  title: 'Search Result/QnaSearchResultComponent',
  component: QnaSearchResultComponent,
  args: { qna: testQnaSearchResult1 },
  argTypes: { orgNavigate: { action: 'orgNavigate' } },
} as Meta<QnaSearchResultComponent>;

type Story = StoryObj<QnaSearchResultComponent>;

export const Primary: Story = {};

export const NoAnswer: Story = {
  args: {
    qna: {
      ...testQnaSearchResult1,
      qna: { ...testPost1, questionSnippet: null, answerSnippet: null },
    },
  },
};
