import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { ClickWrapperComponent } from '../../testing';
import { DropdownWithArrowComponent } from './dropdown-with-arrow.component';

export default {
  title: 'Dropdown/DropdownWithArrowComponent',
  component: DropdownWithArrowComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
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
    expanded: false,
  },
  argTypes: {
    expandedChange: { action: 'expandedChange' },
  },
  render: (args) => ({
    props: args,
    template: `
    <div class="w-fit">
      <newbee-dropdown-with-arrow [labelText]="labelText" [labelClasses]="labelClasses" [disabled]="disabled" [placement]="placement" [offset]="offset" [expandStrategy]="expandStrategy" [expanded]="expanded" (expandedChange)="expandedChange($event)">
        <ul class="menu flex flex-col flex-nowrap">
          <li #dropdownNoToggle><a>Should not shrink dropdown</a></li>
          <li #dropdownNoToggle><a>Should also not shrink dropdown</a></li>
          <li><a>A somewhat long message in this button</a></li>
        </ul>
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
