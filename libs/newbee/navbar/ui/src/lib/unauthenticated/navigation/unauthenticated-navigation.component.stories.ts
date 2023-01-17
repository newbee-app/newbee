import { CommonModule } from '@angular/common';
import { ClickWrapperComponentModule } from '@newbee/newbee/shared/ui';
import { action } from '@storybook/addon-actions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
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
      (story) => `
      <newbee-click-wrapper>
        ${story}
      </newbee-click-wrapper>
      `
    ),
  ],
} as Meta<UnauthenticatedNavigationComponent>;

const Template: Story<UnauthenticatedNavigationComponent> = (
  args: UnauthenticatedNavigationComponent
) => ({
  props: { ...args, navigateToLink: action('navigateToLink') },
});

export const Primary = Template.bind({});
