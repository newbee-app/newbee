import { Meta, StoryObj } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';

export default {
  title: 'SpinnerComponent',
  component: SpinnerComponent,
  parameters: { layout: 'centered' },
} as Meta<SpinnerComponent>;

type Story = StoryObj<SpinnerComponent>;

export const Primary: Story = {};
