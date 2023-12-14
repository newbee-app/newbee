import {
  OrgRoleEnum,
  testOrgMember1,
  testQna1,
  testQnaRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ViewQnaComponent } from './view-qna.component';

export default {
  title: 'ViewQnaComponent',
  component: ViewQnaComponent,
  args: {
    httpClientError: null,
    qna: testQnaRelation1,
    orgMember: testOrgMember1,
    teamMember: testTeamMember1,
    upToDatePending: false,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
    qnaNavigate: { action: 'qnaNavigate' },
    markAsUpToDate: { action: 'markAsUpToDate' },
  },
} as Meta<ViewQnaComponent>;

type Story = StoryObj<ViewQnaComponent>;

export const Primary: Story = {};

export const Member: Story = {
  args: {
    orgMember: { slug: 'bad', role: OrgRoleEnum.Member },
  },
};

export const UpToDatePending: Story = {
  args: { upToDatePending: true },
};

export const NoQuestionAnswer: Story = {
  args: {
    qna: {
      ...testQnaRelation1,
      qna: { ...testQna1, questionHtml: null, answerHtml: null },
    },
  },
};

export const Errors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        'up-to-date': 'Up-to-date error',
      },
    },
  },
};
