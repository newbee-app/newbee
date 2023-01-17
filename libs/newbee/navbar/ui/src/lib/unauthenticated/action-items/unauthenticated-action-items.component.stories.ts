import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { UnauthenticatedActionItemsComponent } from './unauthenticated-action-items.component';

export default {
  title: 'UnauthenticatedActionItemsComponent',
  component: UnauthenticatedActionItemsComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta<UnauthenticatedActionItemsComponent>;

const Template: Story<UnauthenticatedActionItemsComponent> = (
  args: UnauthenticatedActionItemsComponent
) => ({
  props: { ...args, navigateToLink: action('navigateToLink') },
});

export const Primary = Template.bind({});
