import {
  testOrganization1,
  testOrganization2,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { EditOrgComponent } from './edit-org.component';

export default {
  title: 'EditOrgComponent',
  component: EditOrgComponent,
  args: {
    org: testOrganization1,
    orgMember: testOrgMemberRelation1,
    slugTaken: false,
    editPending: false,
    checkPending: false,
    deletePending: false,
    httpClientError: null,
  },
  argTypes: {
    formattedSlug: { action: 'formattedSlug' },
    edit: { action: 'edit' },
    delete: { action: 'delete' },
  },
} as Meta<EditOrgComponent>;

type Story = StoryObj<EditOrgComponent>;

export const Primary: Story = {};

export const NotOwner: Story = { args: { org: testOrganization2 } };

export const SlugTaken: Story = { args: { slugTaken: true } };

export const EditPending: Story = { args: { editPending: true } };

export const CheckPending: Story = { args: { checkPending: true } };

export const DeletePending: Story = { args: { deletePending: true } };

export const HttpError: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: { slug: 'An HTTP client error' },
    },
  },
};
