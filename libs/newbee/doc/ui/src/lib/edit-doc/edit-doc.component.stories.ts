import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testDocRelation1,
  testOrgMember1,
  testOrganization1,
  testTeam1,
  testTeamMember1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { EditDocComponent } from './edit-doc.component';

export default {
  title: 'EditDocComponent',
  component: EditDocComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    httpClientError: null,
    doc: testDocRelation1,
    orgMember: testOrgMember1,
    teamMember: testTeamMember1,
    teams: [testTeam1],
    organization: testOrganization1,
    editDocPending: false,
    upToDatePending: false,
    deletePending: false,
  },
  argTypes: {
    edit: { action: 'edit' },
    markAsUpToDate: { action: 'markAsUpToDate' },
    delete: { action: 'delete' },
  },
} as Meta<EditDocComponent>;

type Story = StoryObj<EditDocComponent>;

export const Primary: Story = {};

export const Pending: Story = {
  args: { editDocPending: true, upToDatePending: true, deletePending: true },
};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        [Keyword.Team]: 'Team error',
        num: 'Num error',
        frequency: 'Frequency error',
        duration: 'Duration error',
        title: 'Title error',
        [Keyword.Doc]: 'Doc error',
        [Keyword.Misc]: 'Misc error',
        'up-to-date': 'Up-to-date error',
      },
    },
  },
};
