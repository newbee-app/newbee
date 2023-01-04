import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ErrorFooterComponentModule } from '../../error-footer/error-footer.component';
import { SearchbarComponentModule } from '../../searchbar/searchbar.component';
import { ClickWrapperComponentModule } from '../../testing';
import { SearchableSelectComponent } from './searchable-select.component';

export default {
  title: 'SearchableSelectComponent',
  component: SearchableSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchbarComponentModule,
        ErrorFooterComponentModule,
        ClickWrapperComponentModule,
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
  args: {
    optionName: 'Country',
    valid: true,
    errorText: '',
  },
} as Meta<SearchableSelectComponent<Country>>;

const Template: Story<SearchableSelectComponent<Country>> = (
  args: SearchableSelectComponent<Country>
) => ({
  props: { ...args, exited: action('exited') },
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

export const Invalid = Template.bind({});
Invalid.args = {
  options: [testSelectOption1, testSelectOption2],
  valid: false,
  errorText: 'Invalid',
};
