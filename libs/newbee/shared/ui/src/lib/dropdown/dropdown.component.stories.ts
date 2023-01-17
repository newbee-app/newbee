import { CommonModule } from '@angular/common';
import {
  Country,
  testSelectOption1,
  testSelectOption2,
} from '@newbee/newbee/shared/util';
import { action } from '@storybook/addon-actions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { ClickWrapperComponentModule } from '../testing';
import { DropdownComponent } from './dropdown.component';

export default {
  title: 'DropdownComponent',
  component: DropdownComponent,
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
  args: {
    dropdownText: 'More',
    options: [testSelectOption1, testSelectOption2],
  },
} as Meta<DropdownComponent<Country>>;

const Template: Story<DropdownComponent<Country>> = (
  args: DropdownComponent<Country>
) => ({
  props: { ...args, selectOption: action('selectOption') },
});

export const Primary = Template.bind({});
