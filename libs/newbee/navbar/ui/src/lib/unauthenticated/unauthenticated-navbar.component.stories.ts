import { CommonModule } from '@angular/common';
import { ClickWrapperComponentModule } from '@newbee/newbee/shared/ui';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { UnauthenticatedActionItemComponentModule } from './action-item/unauthenticated-action-item.component';
import { UnauthenticatedNavigationComponentModule } from './navigation/unauthenticated-navigation.component';
import { UnauthenticatedNavbarComponent } from './unauthenticated-navbar.component';

export default {
  title: 'UnauthenticatedNavbarComponent',
  component: UnauthenticatedNavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ClickWrapperComponentModule,
        UnauthenticatedActionItemComponentModule,
        UnauthenticatedNavigationComponentModule,
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
