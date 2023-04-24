import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { UnauthenticatedActionItemsComponent } from './unauthenticated-action-items.component';

export default {
  title: 'UnauthenticatedActionItemsComponent',
  component: UnauthenticatedActionItemsComponent,
  decorators: [moduleMetadata({ imports: [CommonModule] })],
  argTypes: { navigateToLink: { action: 'navigateToLink' } },
} as Meta<UnauthenticatedActionItemsComponent>;

type Story = StoryObj<UnauthenticatedActionItemsComponent>;

export const Primary: Story = {};
