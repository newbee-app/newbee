import { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

export default {
  title: 'AlertComponent',
  component: AlertComponent,
  args: {
    header: 'Header text',
    text: 'Some text',
    type: 'error',
    includeClearSymbol: true,
    show: true,
  },
  argTypes: {
    showChange: { action: 'showChange' },
  },
} as Meta<AlertComponent>;

type Story = StoryObj<AlertComponent>;

export const Primary: Story = {};

export const TextOnly: Story = { args: { header: '' } };

export const NoClearSymbol: Story = { args: { includeClearSymbol: false } };

export const Info: Story = { args: { type: 'info' } };

export const Success: Story = { args: { type: 'success' } };

export const Warning: Story = { args: { type: 'warning' } };

export const NoShow: Story = { args: { show: false } };
