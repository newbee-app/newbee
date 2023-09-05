import { Meta, StoryObj } from '@storybook/angular';
import { NotFoundErrorComponent } from './not-found-error.component';

export default {
  title: 'Error/NotFoundErrorComponent',
  component: NotFoundErrorComponent,
  argTypes: { navigateHome: { action: 'navigateHome' } },
} as Meta<NotFoundErrorComponent>;

type Story = StoryObj<NotFoundErrorComponent>;

export const Primary: Story = {};
