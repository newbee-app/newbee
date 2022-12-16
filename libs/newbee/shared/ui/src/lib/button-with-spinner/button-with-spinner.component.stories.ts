import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
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
} as Meta<ButtonWithSpinnerComponent>;

const Template: Story<ButtonWithSpinnerComponent> = (
  args: ButtonWithSpinnerComponent
) => ({
  props: { ...args, buttonClick: action('buttonClick') },
});

export const Primary = Template.bind({});
