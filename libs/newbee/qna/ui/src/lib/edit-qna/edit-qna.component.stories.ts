import { AppWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  OrgRoleEnum,
  testOrgMemberUser1,
  testOrgMemberUser2,
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
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  args: {
    httpClientError: null,
    qna: testQnaRelation1,
    orgMember: testOrgMemberUser1,
    teamMember: testTeamMember1,
    teams: [testTeam1],
    organization: testOrganization1,
    orgMembers: [testOrgMemberUser1, testOrgMemberUser2],
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

export const Member: Story = {
  args: {
    qna: testQnaRelation1,
    orgMember: {
      ...testOrgMemberUser1,
      orgMember: { slug: 'bad', role: OrgRoleEnum.Member },
    },
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
        [Keyword.Team]: 'Team error',
        title: 'Title error',
        [Keyword.Question]: 'Question error',
        [`${Keyword.Question}-${Keyword.Edit}`]: 'Question edit error',
        num: 'Num error',
        frequency: 'Frequency error',
        upToDateDuration: 'Up-to-date duration error',
        maintainer: 'Maintainer error',
        [Keyword.Answer]: 'Answer error',
        [`${Keyword.Answer}-${Keyword.Edit}`]: 'Answer edit error',
      },
    },
  },
};
