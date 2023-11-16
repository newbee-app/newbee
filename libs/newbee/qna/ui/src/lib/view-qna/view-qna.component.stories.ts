import {
  OrgRoleEnum,
  TeamRoleEnum,
  testOrgMember1,
  testOrgMemberRelation1,
  testOrgMemberUser1,
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

export const UpToDatePending: Story = {
  args: { upToDatePending: true },
};

export const NoMember: Story = {
  args: { orgMember: null, teamMember: null },
};

export const NoQuestionAnswer: Story = {
  args: {
    qna: {
      ...testQnaRelation1,
      qna: { ...testQna1, questionHtml: null, answerHtml: null },
    },
  },
};

export const NoQuestionAnswerPermissions: Story = {
  args: {
    ...NoQuestionAnswer.args,
    orgMember: null,
    teamMember: null,
  },
};

export const IsCreator: Story = {
  args: {
    qna: {
      ...testQnaRelation1,
      maintainer: {
        ...testOrgMemberUser1,
        orgMember: { ...testOrgMember1, slug: 'nonsense' },
      },
    },
    orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
    teamMember: { ...testTeamMember1, role: TeamRoleEnum.Member },
  },
};

export const IsMaintainer: Story = {
  args: {
    ...IsCreator.args,
    qna: {
      ...testQnaRelation1,
      creator: {
        ...testOrgMemberRelation1,
        orgMember: { ...testOrgMember1, slug: 'nonsense' },
      },
    },
  },
};

export const NoMaintainerTeamMember: Story = {
  args: {
    ...IsCreator.args,
    qna: {
      ...testQnaRelation1,
      creator: null,
      maintainer: null,
    },
  },
};
