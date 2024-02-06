import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../util';
import { PhoneInputComponent } from './phone-input.component';

export default {
  title: 'Form Control/PhoneInputComponent',
  component: PhoneInputComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  parameters: { layout: 'centered' },
} as Meta<PhoneInputComponent>;

type Story = StoryObj<PhoneInputComponent>;

export const Primary: Story = {};
