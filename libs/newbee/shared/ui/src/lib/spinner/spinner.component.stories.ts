import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';

export default {
  title: 'SpinnerComponent',
  component: SpinnerComponent,
  decorators: [moduleMetadata({})],
  parameters: {
    layout: 'centered',
  },
} as Meta<SpinnerComponent>;

const Template: Story<SpinnerComponent> = (args: SpinnerComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
