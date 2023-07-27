import { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

export default {
  title: 'AlertComponent',
  component: AlertComponent,
  args: {
    text: 'Some text',
    type: 'error',
  },
} as Meta<AlertComponent>;

type Story = StoryObj<AlertComponent>;

export const ShortText: Story = {};

export const LongText: Story = {
  args: {
    text: 'Some really really really really really really really really really really really really really really really really really really really really long text',
  },
};

export const Info: Story = { args: { type: 'info' } };

export const Success: Story = { args: { type: 'success' } };

export const Warning: Story = { args: { type: 'warning' } };
