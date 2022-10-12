import { CommonModule } from '@angular/common';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';

export default {
  title: 'TooltipComponent',
  component: TooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  args: {
    containerId: 'container',
    tooltipId: 'tooltip',
    messageId: 'tooltip-message',
    tailId: 'tooltip-tail',
  },
} as Meta<TooltipComponent>;

const Template: Story<TooltipComponent> = (args: TooltipComponent) => ({
  props: args,
  template: `
    <newbee-tooltip [containerId]="container" [tooltipId]="tooltip" [messageId]="message" [tailId]="tail" [message]="message" [displayTooltip]="displayTooltip">
      <div>This is a medium length sample div</div>
    </newbee-tooltip>
  `,
});

export const LongMessage = Template.bind({});
LongMessage.args = {
  message: 'This is a really long sample tooltip message',
  displayTooltip: true,
};

export const ShortMessage = Template.bind({});
ShortMessage.args = {
  message: 'Short',
  displayTooltip: true,
};

export const NoDisplay = Template.bind({});
NoDisplay.args = {
  message: 'This will not be displayed',
  displayTooltip: false,
};
