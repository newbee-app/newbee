import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { NavbarComponent } from './navbar.component';

export default {
  title: 'NavbarComponent',
  component: NavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<NavbarComponent>;

const Template: Story<NavbarComponent> = (args: NavbarComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  authenticated: false,
};
