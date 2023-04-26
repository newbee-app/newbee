import { CommonModule } from '@angular/common';
import {
  Country,
  testSelectOptionCountry1,
  testSelectOptionCountry2,
} from '@newbee/newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../testing';
import { DropdownComponent } from './dropdown.component';

export default {
  title: 'DropdownComponent',
  component: DropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ClickWrapperComponent],
    }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    dropdownText: 'More',
    options: [testSelectOptionCountry1, testSelectOptionCountry2],
  },
  argTypes: {
    selectOption: { action: 'selectOption' },
  },
} as Meta<DropdownComponent<Country>>;

type Story = StoryObj<DropdownComponent<Country>>;

export const Short: Story = {};

export const Long: Story = {
  args: {
    options: [
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
      testSelectOptionCountry1,
    ],
  },
};
