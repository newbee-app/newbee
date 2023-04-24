import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { SpinnerComponentModule } from '../spinner/spinner.component';
import { ButtonWithSpinnerComponent } from './button-with-spinner.component';

export default {
  title: 'ButtonWithSpinnerComponent',
  component: ButtonWithSpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SpinnerComponentModule],
    }),
  ],
  args: {
    displaySpinner: false,
    disabled: false,
    buttonText: 'Send',
    buttonId: 'button',
  },
  argTypes: {
    buttonClick: { action: 'buttonClick' },
  },
} as Meta<ButtonWithSpinnerComponent>;

type Story = StoryObj<ButtonWithSpinnerComponent>;

export const Primary: Story = {};
