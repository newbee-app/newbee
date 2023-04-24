import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { UnauthenticatedActionItemComponent } from './unauthenticated-action-item.component';

export default {
  title: 'UnauthenticatedActionItemComponent',
  component: UnauthenticatedActionItemComponent,
  decorators: [moduleMetadata({ imports: [CommonModule] })],
  argTypes: { navigateToLink: { action: 'navigateToLink' } },
} as Meta<UnauthenticatedActionItemComponent>;

type Story = StoryObj<UnauthenticatedActionItemComponent>;

export const Primary: Story = {};
