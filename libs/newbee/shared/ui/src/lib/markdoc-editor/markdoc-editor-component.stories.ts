import { Meta, StoryObj } from '@storybook/angular';
import { MarkdocEditorComponent } from './markdoc-editor.component';

export default {
  title: 'MarkdocEditorComponent',
  component: MarkdocEditorComponent,
  args: {
    text: '\n',
  },
} as Meta<MarkdocEditorComponent>;

type Story = StoryObj<MarkdocEditorComponent>;

export const EmptyText: Story = {};

export const Tag: Story = {
  args: {
    text: `{% name $var1.var2["var3"] attrib1="value" attrib2=123 attrib3=func(123, "abc", hello="world") attrib4=[1, 2, 3] attrib5={ hello: "world" } #id .class %}\n`,
  },
};
