import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  testDocRelation1,
  testOrgMember1,
  testOrgMemberRelation1,
  testQnaRelation1,
  testTeamMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ViewOrgMemberComponent } from './view-org-member.component';

export default {
  title: 'ViewOrgMemberComponent',
  component: ViewOrgMemberComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    orgMember: {
      ...testOrgMemberRelation1,
      teams: {
        sample: [
          testTeamMemberRelation1,
          testTeamMemberRelation1,
          testTeamMemberRelation1,
          testTeamMemberRelation1,
          testTeamMemberRelation1,
        ],
        total: 100,
      },
      createdQnas: {
        sample: [testQnaRelation1, testQnaRelation1, testQnaRelation1],
        total: 100,
      },
      maintainedQnas: {
        sample: [testQnaRelation1, testQnaRelation1, testQnaRelation1],
        total: 100,
      },
      createdDocs: {
        sample: [testDocRelation1, testDocRelation1, testDocRelation1],
        total: 100,
      },
      maintainedDocs: {
        sample: [testDocRelation1, testDocRelation1, testDocRelation1],
        total: 100,
      },
    },
    userOrgMember: testOrgMember1,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
    memberNavigate: { action: 'memberNavigate' },
    editRole: { action: 'editRole' },
    delete: { action: 'delete' },
  },
} as Meta<ViewOrgMemberComponent>;

type Story = StoryObj<ViewOrgMemberComponent>;

export const Primary: Story = {};

export const NoUserOrgMember: Story = { args: { userOrgMember: null } };

export const LongDisplayName: Story = {
  args: {
    orgMember: {
      ...testOrgMemberRelation1,
      user: {
        ...testUser1,
        displayName:
          'Really really really really really really really really long display name',
      },
    },
  },
};
