import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  OrgRoleEnum,
  TeamRoleEnum,
  testOrgMember1,
  testOrgMemberUser1,
  testOrganization1,
  testQnaRelation1,
  testTeam1,
  testTeamMember1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { EditQnaComponent } from './edit-qna.component';

export default {
  title: 'EditQnaComponent',
  component: EditQnaComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    httpClientError: null,
    qna: testQnaRelation1,
    orgMember: testOrgMember1,
    teamMember: testTeamMember1,
    teams: [testTeam1],
    organization: testOrganization1,
    editQuestionPending: false,
    editAnswerPending: false,
    upToDatePending: false,
    deletePending: false,
  },
  argTypes: {
    editQuestion: { action: 'editQuestion' },
    editAnswer: { action: 'editAnswer' },
    markAsUpToDate: { action: 'markAsUpToDate' },
    delete: { action: 'delete' },
  },
} as Meta<EditQnaComponent>;

type Story = StoryObj<EditQnaComponent>;

export const Primary: Story = {};

export const NoPermissions: Story = {
  args: {
    qna: testQnaRelation1,
    orgMember: { slug: 'bad', role: OrgRoleEnum.Member },
    teamMember: null,
  },
};

export const OnlyAnswerPermissions: Story = {
  args: {
    orgMember: { slug: 'bad', role: OrgRoleEnum.Member },
    teamMember: { role: TeamRoleEnum.Member },
  },
};

export const OnlyCreator: Story = {
  args: {
    qna: {
      ...testQnaRelation1,
      creator: {
        ...testOrgMemberUser1,
        orgMember: { slug: 'creator', role: OrgRoleEnum.Member },
      },
    },
    orgMember: { slug: 'creator', role: OrgRoleEnum.Member },
    teamMember: null,
  },
};

export const Pending: Story = {
  args: {
    editQuestionPending: true,
    editAnswerPending: true,
    upToDatePending: true,
    deletePending: true,
  },
};

export const HttpClientErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        'up-to-date': 'Up-to-date error',
        team: 'Team error',
        title: 'Title error',
        question: 'Question error',
        [`question-${Keyword.Edit}`]: 'Question edit error',
        num: 'Num error',
        frequency: 'Frequency error',
        answer: 'Answer error',
        [`answer-${Keyword.Edit}`]: 'Answer edit error',
      },
    },
  },
};
