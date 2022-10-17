import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
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
import { ClickWrapperModule } from '../../storybook-wrapper';
import { SearchableSelectComponent } from './searchable-select.component';

export default {
  title: 'SearchableSelectComponent',
  component: SearchableSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, ClickWrapperModule],
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
    optionName: 'Country',
    expand: false,
  },
} as Meta<SearchableSelectComponent>;

const Template: Story<SearchableSelectComponent> = (
  args: SearchableSelectComponent
) => ({
  props: { ...args, selected: action('selected') },
});

export const Short = Template.bind({});
Short.args = {
  options: [testSelectOption1, testSelectOption2],
};

export const Long = Template.bind({});
Long.args = {
  options: [
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
    testSelectOption1,
  ],
};

export const DefaultSelectOption = Template.bind({});
DefaultSelectOption.args = {
  options: [testSelectOption1, testSelectOption2],
  defaultOption: testSelectOption1,
};

export const DefaultString = Template.bind({});
DefaultString.args = {
  options: [testSelectOption1, testSelectOption2],
  defaultOption: testSelectOption1.value,
};
