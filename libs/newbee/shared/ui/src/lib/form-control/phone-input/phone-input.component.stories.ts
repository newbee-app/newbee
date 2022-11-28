import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  PhoneNumberInputDirectiveModule,
  PhoneNumberPipeModule,
} from '@newbee/newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { ClickWrapperComponentModule } from '../../testing';
import { TooltipComponentModule } from '../../tooltip/tooltip.component';
import { SearchableSelectComponentModule } from '../searchable-select/searchable-select.component';
import { PhoneInputComponent } from './phone-input.component';

export default {
  title: 'PhoneInputComponent',
  component: PhoneInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchableSelectComponentModule,
        TooltipComponentModule,
        PhoneNumberInputDirectiveModule,
        PhoneNumberPipeModule,
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
  parameters: {
    layout: 'centered',
  },
} as Meta<PhoneInputComponent>;

const Template: Story<PhoneInputComponent> = (args: PhoneInputComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
