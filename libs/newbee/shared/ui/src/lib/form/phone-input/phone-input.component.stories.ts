import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { ClickWrapperModule } from '../../storybook-wrapper';
import { SearchableSelectModule } from '../searchable-select/searchable-select.component';
import { PhoneInputComponent } from './phone-input.component';

export default {
  title: 'PhoneInputComponent',
  component: PhoneInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchableSelectModule,
        ClickWrapperModule,
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
} as Meta<PhoneInputComponent>;

const Template: Story<PhoneInputComponent> = (args: PhoneInputComponent) => ({
  props: { ...args, phoneNumber: action('phoneNumber') },
});

export const Primary = Template.bind({});
Primary.args = {};
