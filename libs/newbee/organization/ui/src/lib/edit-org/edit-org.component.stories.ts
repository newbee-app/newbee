import {
  OrgRoleEnum,
  testOrgMember1,
  testOrgMemberRelation1,
} from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { EditOrgComponent } from './edit-org.component';

export default {
  title: 'EditOrgComponent',
  component: EditOrgComponent,
  args: {
    orgMember: testOrgMemberRelation1,
    slugTaken: false,
    editPending: false,
    editSlugPending: false,
    checkPending: false,
    deletePending: false,
    httpClientError: null,
  },
  argTypes: {
    slug: { action: 'slug' },
    formattedSlug: { action: 'formattedSlug' },
    edit: { action: 'edit' },
    editSlug: { action: 'editSlug' },
    delete: { action: 'delete' },
  },
} as Meta<EditOrgComponent>;

type Story = StoryObj<EditOrgComponent>;

export const Primary: Story = {};

export const NotOwner: Story = {
  args: {
    orgMember: {
      ...testOrgMemberRelation1,
      orgMember: { ...testOrgMember1, role: OrgRoleEnum.Moderator },
    },
  },
};

export const SlugTaken: Story = { args: { slugTaken: true } };

export const EditPending: Story = { args: { editPending: true } };

export const EditSlugPending: Story = { args: { editSlugPending: true } };

export const CheckPending: Story = { args: { checkPending: true } };

export const DeletePending: Story = { args: { deletePending: true } };

export const HttpError: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: { misc: 'An HTTP client error' },
    },
  },
};