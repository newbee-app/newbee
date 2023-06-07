import { Meta, StoryObj } from '@storybook/angular';
import { CreateOrgComponent } from './create-org.component';

export default {
  title: 'CreateOrgComponent',
  component: CreateOrgComponent,
  args: {
    createPending: false,
    httpClientError: null,
  },
  argTypes: {
    create: { action: 'create' },
  },
} as Meta<CreateOrgComponent>;

type Story = StoryObj<CreateOrgComponent>;

export const Primary: Story = {};

export const WithError: Story = {
  args: {
    httpClientError: { status: 400, messages: { name: 'Name is required' } },
  },
};

export const CreatePending: Story = { args: { createPending: true } };
