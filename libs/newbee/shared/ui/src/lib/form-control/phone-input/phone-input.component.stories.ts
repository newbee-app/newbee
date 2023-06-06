import { componentWrapperDecorator, Meta, StoryObj } from '@storybook/angular';
import { PhoneInputComponent } from './phone-input.component';

export default {
  title: 'PhoneInputComponent',
  component: PhoneInputComponent,
  decorators: [
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  parameters: { layout: 'centered' },
} as Meta<PhoneInputComponent>;

type Story = StoryObj<PhoneInputComponent>;

export const Primary: Story = {};
