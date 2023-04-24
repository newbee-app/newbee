import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ErrorFooterComponent } from './error-footer.component';

export default {
  title: 'ErrorFooterComponent',
  component: ErrorFooterComponent,
  decorators: [moduleMetadata({ imports: [CommonModule] })],
  args: {
    error: '',
    displayError: true,
  },
} as Meta<ErrorFooterComponent>;

type Story = StoryObj<ErrorFooterComponent>;

export const NoError: Story = {};

export const WithError: Story = {
  args: { error: 'Some error' },
};

export const LongError: Story = {
  args: {
    error:
      'Some really really really really really really really really really really really really really really really really really really really really long error',
  },
};
