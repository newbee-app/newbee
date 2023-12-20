import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { AppWrapperComponent } from '../../testing';
import { NumAndFreqInputComponent } from './num-and-freq-input.component';

export default {
  title: 'Form Control/NumAndFreqInputComponent',
  component: NumAndFreqInputComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  parameters: { layout: 'centered' },
} as Meta<NumAndFreqInputComponent>;

type Story = StoryObj<NumAndFreqInputComponent>;

export const Primary: Story = {};
