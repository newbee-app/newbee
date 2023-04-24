import { Meta, StoryObj } from '@storybook/angular';
import { NavbarComponent } from './navbar.component';

export default {
  title: 'NavbarComponent',
  component: NavbarComponent,
  args: { authenticated: false },
} as Meta<NavbarComponent>;

type Story = StoryObj<NavbarComponent>;

export const Primary: Story = {};
