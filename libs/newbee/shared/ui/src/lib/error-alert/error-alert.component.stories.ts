import { Meta, StoryObj } from '@storybook/angular';
import { ErrorAlertComponent } from './error-alert.component';

export default {
  title: 'ErrorAlertComponent',
  component: ErrorAlertComponent,
  args: {
    text: 'Some error',
  },
} as Meta<ErrorAlertComponent>;

type Story = StoryObj<ErrorAlertComponent>;

export const ShortError: Story = {};

export const LongError: Story = {
  args: {
    text: 'Some really really really really really really really really really really really really really really really really really really really really long error',
  },
};
