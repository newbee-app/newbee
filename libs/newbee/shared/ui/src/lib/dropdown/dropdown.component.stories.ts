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
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  parameters: { layout: 'centered' },
  args: { placement: 'bottom', expanded: false },
  argTypes: {
    expandedChange: { action: 'expandedChange' },
  },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-dropdown [placement]="placement" [expanded]="expanded" (expandedChange)="expandedChange($event)">
        <button label type="button" class="btn btn-primary">Click me</button>

        <div dropdown class="flex flex-col flex-nowrap">
          <button type="button" class="btn btn-ghost justify-start text-left normal-case font-normal">A somewhat long message in this button</button>
        </div>
      </newbee-dropdown>
    </div>
    `,
  }),
} as Meta<DropdownComponent>;

type Story = StoryObj<DropdownComponent>;

export const Bottom: Story = {};

export const Top: Story = { args: { placement: 'top' } };

export const Left: Story = { args: { placement: 'left' } };

export const Right: Story = { args: { placement: 'right' } };
