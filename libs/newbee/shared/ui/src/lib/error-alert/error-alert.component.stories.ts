import { Meta, StoryObj } from '@storybook/angular';
import { ErrorAlertComponent } from './error-alert.component';

export default {
  title: 'ErrorAlertComponent',
  component: ErrorAlertComponent,
  args: {
    error: '',
    displayError: true,
  },
} as Meta<ErrorAlertComponent>;

type Story = StoryObj<ErrorAlertComponent>;

export const ShortError: Story = {
  args: { text: 'Some error' },
};

export const LongError: Story = {
  args: {
    text: 'Some really really really really really really really really really really really really really really really really really really really really long error',
  },
};
