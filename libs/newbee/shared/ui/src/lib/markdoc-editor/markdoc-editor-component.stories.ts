import { Meta, StoryObj } from '@storybook/angular';
import { MarkdocEditorComponent } from './markdoc-editor.component';

export default {
  title: 'MarkdocEditorComponent',
  component: MarkdocEditorComponent,
  args: {
    text: '',
  },
} as Meta<MarkdocEditorComponent>;

type Story = StoryObj<MarkdocEditorComponent>;

export const Primary: Story = {};
