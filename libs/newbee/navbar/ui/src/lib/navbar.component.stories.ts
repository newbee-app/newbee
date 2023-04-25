import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { NavbarComponent } from './navbar.component';

export default {
  title: 'NavbarComponent',
  component: NavbarComponent,
  decorators: [moduleMetadata({ imports: [CommonModule] })],
  args: { authenticated: false },
} as Meta<NavbarComponent>;

type Story = StoryObj<NavbarComponent>;

export const Primary: Story = {};
