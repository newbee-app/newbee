import { CommonModule } from '@angular/common';
import { ClickWrapperComponentModule } from '@newbee/newbee/shared/ui';
import { action } from '@storybook/addon-actions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { UnauthenticatedActionItemsComponentModule } from './action-items/unauthenticated-action-items.component';
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
        UnauthenticatedActionItemsComponentModule,
        UnauthenticatedNavigationComponentModule,
      ],
    }),
    componentWrapperDecorator(
      (story) => `
      <newbee-click-wrapper>
        ${story}
      </newbee-click-wrapper>
      `
    ),
  ],
} as Meta<UnauthenticatedNavbarComponent>;

const Template: Story<UnauthenticatedNavbarComponent> = (
  args: UnauthenticatedNavbarComponent
) => ({
  props: { ...args, navigateToLink: action('navigateToLink') },
});

export const Primary = Template.bind({});
