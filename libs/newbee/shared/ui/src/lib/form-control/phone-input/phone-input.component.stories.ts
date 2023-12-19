import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { AppWrapperComponent } from '../../testing';
import { PhoneInputComponent } from './phone-input.component';

export default {
  title: 'Form Control/PhoneInputComponent',
  component: PhoneInputComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  parameters: { layout: 'centered' },
} as Meta<PhoneInputComponent>;

type Story = StoryObj<PhoneInputComponent>;

export const Primary: Story = {};
