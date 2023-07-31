import { testOrganization1 } from '@newbee/shared/util';
import { Meta, StoryObj } from '@storybook/angular';
import { CreateOrgComponent } from './create-org.component';

export default {
  title: 'CreateOrgComponent',
  component: CreateOrgComponent,
  args: {
    generatedSlug: '',
    slugTaken: false,
    createPending: false,
    checkPending: false,
    httpClientError: null,
  },
  argTypes: {
    name: { action: 'name' },
    slug: { action: 'slug' },
    formattedSlug: { action: 'formattedSlug' },
    create: { action: 'create' },
  },
} as Meta<CreateOrgComponent>;

type Story = StoryObj<CreateOrgComponent>;

export const Primary: Story = {};

export const GeneratedSlug: Story = {
  args: { generatedSlug: testOrganization1.slug },
};

export const SlugTaken: Story = { args: { slugTaken: true } };

export const CreatePending: Story = { args: { createPending: true } };

export const CheckPending: Story = { args: { checkPending: true } };

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: { name: 'Name error', slug: 'Slug error', misc: 'Misc error' },
    },
  },
};
