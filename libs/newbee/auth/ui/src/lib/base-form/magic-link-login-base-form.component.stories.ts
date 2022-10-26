import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { MagicLinkLoginBaseFormComponent } from './magic-link-login-base-form.component';

export default {
  title: 'MagicLinkLoginBaseFormComponent',
  component: MagicLinkLoginBaseFormComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<MagicLinkLoginBaseFormComponent>;

const Template: Story<MagicLinkLoginBaseFormComponent> = (
  args: MagicLinkLoginBaseFormComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
