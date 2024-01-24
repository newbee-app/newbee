import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  OrgRoleEnum,
  defaultLimit,
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
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
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
        results: [
          testQnaQueryResult1,
          testQnaQueryResult1,
          testQnaQueryResult1,
        ],
        total: 100,
        offset: 0,
        limit: defaultLimit,
      },
      maintainedQnas: {
        results: [
          testQnaQueryResult1,
          testQnaQueryResult1,
          testQnaQueryResult1,
        ],
        total: 100,
        offset: 0,
        limit: defaultLimit,
      },
      createdDocs: {
        results: [
          testDocQueryResult1,
          testDocQueryResult1,
          testDocQueryResult1,
        ],
        total: 100,
        offset: 0,
        limit: defaultLimit,
      },
      maintainedDocs: {
        results: [
          testDocQueryResult1,
          testDocQueryResult1,
          testDocQueryResult1,
        ],
        total: 100,
        offset: 0,
        limit: defaultLimit,
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
