import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { UnauthenticatedNavbarComponent } from './unauthenticated-navbar.component';

export default {
  title: 'UnauthenticatedNavbarComponent',
  component: UnauthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
  argTypes: {
    navigateToLink: { action: 'navigateToLink' },
  },
} as Meta<UnauthenticatedNavbarComponent>;

type Story = StoryObj<UnauthenticatedNavbarComponent>;

export const Primary: Story = {};
