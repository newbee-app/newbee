import { CommonModule } from '@angular/common';
import { ClickWrapperComponentModule } from '@newbee/newbee/shared/ui';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { UnauthenticatedNavigationComponent } from './unauthenticated-navigation.component';

export default {
  title: 'UnauthenticatedNavigationComponent',
  component: UnauthenticatedNavigationComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ClickWrapperComponentModule],
    }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  argTypes: { navigateToLink: { action: 'navigateToLink' } },
} as Meta<UnauthenticatedNavigationComponent>;

type Story = StoryObj<UnauthenticatedNavigationComponent>;

export const Primary: Story = {};
