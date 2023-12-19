import { AppWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  OrgRoleEnum,
  testDocQueryResult1,
  testOrgMember1,
  testOrgMemberRelation1,
  testQnaQueryResult1,
  testTeamMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ViewOrgMemberComponent } from './view-org-member.component';

export default {
  title: 'ViewOrgMemberComponent',
  component: ViewOrgMemberComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  args: {
    orgMember: {
      ...testOrgMemberRelation1,
      teams: [
        testTeamMemberRelation1,
        testTeamMemberRelation1,
        testTeamMemberRelation1,
        testTeamMemberRelation1,
        testTeamMemberRelation1,
      ],
      createdQnas: {
        sample: [testQnaQueryResult1, testQnaQueryResult1, testQnaQueryResult1],
        total: 100,
      },
      maintainedQnas: {
        sample: [testQnaQueryResult1, testQnaQueryResult1, testQnaQueryResult1],
        total: 100,
      },
      createdDocs: {
        sample: [testDocQueryResult1, testDocQueryResult1, testDocQueryResult1],
        total: 100,
      },
      maintainedDocs: {
        sample: [testDocQueryResult1, testDocQueryResult1, testDocQueryResult1],
        total: 100,
      },
    },
    userOrgMember: testOrgMember1,
    editPending: false,
    deletePending: false,
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

export const MemberPermissions: Story = {
  args: {
    userOrgMember: { slug: 'bad', role: OrgRoleEnum.Member },
  },
};

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

export const EditPending: Story = { args: { editPending: true } };

export const DeletePending: Story = { args: { deletePending: true } };
