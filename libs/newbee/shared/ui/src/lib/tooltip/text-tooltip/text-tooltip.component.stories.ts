import { Meta, StoryObj } from '@storybook/angular';
import { TextTooltipComponent } from './text-tooltip.component';

export default {
  title: 'Tooltip/TextTooltipComponent',
  component: TextTooltipComponent,
  parameters: { layout: 'centered' },
  args: {
    text: `I'm a tooltip`,
    placement: 'top',
    offset: 10,
    includeTail: true,
  },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-text-tooltip [text]="text" [placement]="placement" [offset]="offset" [includeTail]="includeTail">
        <button type="button" class="btn btn-primary">Hover me</button>
      </newbee-text-tooltip>
    </div>
    `,
  }),
} as Meta<TextTooltipComponent>;

type Story = StoryObj<TextTooltipComponent>;

export const Primary: Story = {};
