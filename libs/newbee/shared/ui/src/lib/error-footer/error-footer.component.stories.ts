import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ErrorFooterComponent } from './error-footer.component';

export default {
  title: 'ErrorFooterComponent',
  component: ErrorFooterComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
  args: {
    error: '',
    displayError: true,
  },
} as Meta<ErrorFooterComponent>;

const Template: Story<ErrorFooterComponent> = (args: ErrorFooterComponent) => ({
  props: args,
});

export const NoError = Template.bind({});

export const WithError = Template.bind({});
WithError.args = {
  error: 'Some error',
};

export const LongError = Template.bind({});
LongError.args = {
  error:
    'Some really really really really really really really really really really really really really really really really really really really really long error',
};
