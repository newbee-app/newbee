import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BaseFormComponent } from './base-form.component';

export default {
  title: 'BaseFormComponent',
  component: BaseFormComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<BaseFormComponent>;

const Template: Story<BaseFormComponent> = (args: BaseFormComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
