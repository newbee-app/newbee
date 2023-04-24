import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';

export default {
  title: 'TooltipComponent',
  component: TooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
  parameters: { layout: 'centered' },
} as Meta<TooltipComponent>;

type Story = StoryObj<TooltipComponent>;

export const LongMessage: Story = {
  render: (args) => ({
    props: args,
    template: `<newbee-tooltip [message]="message" [displayTooltip]="displayTooltip">
      <div>This is a medium length sample div</div>
    </newbee-tooltip>`,
  }),
  args: {
    message: 'This is a really long sample tooltip message',
    displayTooltip: true,
  },
};

export const ShortMessage: Story = {
  ...LongMessage,
  args: {
    message: 'Short',
    displayTooltip: true,
  },
};

export const NoDisplay: Story = {
  ...LongMessage,
  args: {
    message: 'This will not be displayed',
    displayTooltip: false,
  },
};
