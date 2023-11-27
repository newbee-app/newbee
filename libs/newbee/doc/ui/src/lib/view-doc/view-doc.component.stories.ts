import {
  OrgRoleEnum,
  testDocRelation1,
  testOrgMember1,
  testOrgMemberRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { ViewDocComponent } from './view-doc.component';

export default {
  title: 'ViewDocComponent',
  component: ViewDocComponent,
  args: {
    httpClientError: null,
    doc: testDocRelation1,
    orgMember: testOrgMember1,
    teamMember: testTeamMember1,
    upToDatePending: false,
  },
  argTypes: {
    orgNavigate: { action: 'orgNavigate' },
    docNavigate: { action: 'docNavigate' },
    markAsUpToDate: { action: 'markAsUpToDate' },
  },
} as Meta<ViewDocComponent>;

type Story = StoryObj<ViewDocComponent>;

export const Primary: Story = {};

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        'up-to-date': 'Up-to-date error',
      },
    },
  },
};

export const NoMaintainer: Story = {
  args: {
    doc: { ...testDocRelation1, maintainer: null },
  },
};

export const NoCreator: Story = {
  args: {
    doc: { ...testDocRelation1, creator: null },
  },
};

export const CreatorNotMaintainer: Story = {
  args: {
    doc: {
      ...testDocRelation1,
      creator: {
        ...testOrgMemberRelation1,
        orgMember: { role: OrgRoleEnum.Moderator, slug: 'creator' },
      },
    },
  },
};
