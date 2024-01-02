import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../testing';
import { NumAndFreqInputComponent } from './num-and-freq-input.component';

export default {
  title: 'Form Control/NumAndFreqInputComponent',
  component: NumAndFreqInputComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  parameters: { layout: 'centered' },
} as Meta<NumAndFreqInputComponent>;

type Story = StoryObj<NumAndFreqInputComponent>;

export const Primary: Story = {};
