import { Meta, StoryObj } from '@storybook/angular';
import { UnauthenticatedNavbarComponent } from './unauthenticated-navbar.component';

export default {
  title: 'UnauthenticatedNavbarComponent',
  component: UnauthenticatedNavbarComponent,
  argTypes: {
    navigateToLink: { action: 'navigateToLink' },
  },
} as Meta<UnauthenticatedNavbarComponent>;

type Story = StoryObj<UnauthenticatedNavbarComponent>;

export const Primary: Story = {};
