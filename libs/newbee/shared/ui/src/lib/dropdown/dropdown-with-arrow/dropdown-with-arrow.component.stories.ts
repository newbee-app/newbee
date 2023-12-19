import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { AppWrapperComponent } from '../../testing';
import { DropdownWithArrowComponent } from './dropdown-with-arrow.component';

export default {
  title: 'Dropdown/DropdownWithArrowComponent',
  component: DropdownWithArrowComponent,
  decorators: [
    moduleMetadata({ imports: [AppWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-app-wrapper>${story}</newbee-app-wrapper>`,
    ),
  ],
  parameters: { layout: 'centered' },
  args: {
    labelText: 'Click me',
    labelClasses: {},
    disabled: false,
    placement: 'bottom',
    offset: 10,
    expandStrategy: 'toggle',
    portal: true,
    expanded: false,
  },
  argTypes: {
    expandedChange: { action: 'expandedChange' },
  },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-dropdown-with-arrow [labelText]="labelText" [labelClasses]="labelClasses" [disabled]="disabled" [placement]="placement" [offset]="offset" [expandStrategy]="expandStrategy" [portal]="portal" [expanded]="expanded" (expandedChange)="expandedChange($event)">
        <div class="flex flex-col flex-nowrap">
          <button #dropdownNoToggle type="button" class="btn btn-ghost justify-start text-left normal-case font-normal">Should not shrink dropdown</button>

          <button #dropdownNoToggle type="button" class="btn btn-ghost justify-start text-left normal-case font-normal">Should also not shrink dropdown</button>

          <button type="button" class="btn btn-ghost justify-start text-left normal-case font-normal">A somewhat long message in this button</button>
        </div>
      </newbee-dropdown-with-arrow>
    </div>
    `,
  }),
} as Meta<DropdownWithArrowComponent>;

type Story = StoryObj<DropdownWithArrowComponent>;

export const Enabled: Story = {};

export const WithClasses: Story = {
  args: { labelClasses: { 'btn-primary': true } },
};

export const Diabled: Story = { args: { disabled: true } };
