import { CommonModule } from '@angular/common';
import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { UnauthenticatedActionItemComponent } from './action-item/unauthenticated-action-item.component';
import { UnauthenticatedNavigationComponent } from './navigation/unauthenticated-navigation.component';
import { UnauthenticatedNavbarComponent } from './unauthenticated-navbar.component';

export default {
  title: 'UnauthenticatedNavbarComponent',
  component: UnauthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ClickWrapperComponent,
        UnauthenticatedActionItemComponent,
        UnauthenticatedNavigationComponent,
      ],
    }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  argTypes: {
    navigateToLink: { action: 'navigateToLink' },
  },
} as Meta<UnauthenticatedNavbarComponent>;

type Story = StoryObj<UnauthenticatedNavbarComponent>;

export const Primary: Story = {};
