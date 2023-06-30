import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import { testUser1, testUser2 } from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { EditUserComponent } from './edit-user.component';

export default {
  title: 'EditUserComponent',
  component: EditUserComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`
    ),
  ],
  args: {
    user: testUser1,
    editPending: false,
    deletePending: false,
  },
  argTypes: {
    edit: { action: 'edit' },
    delete: { action: 'delete' },
  },
} as Meta<EditUserComponent>;

type Story = StoryObj<EditUserComponent>;

export const Primary: Story = {};

export const OptionalsExcluded: Story = {
  args: { user: testUser2 },
};

export const EditPending: Story = { args: { editPending: true } };

export const DeletePending: Story = { args: { deletePending: true } };

export const HttpError: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        name: 'Name error',
        displayName: 'Display name error',
        delete: 'Delete error',
        misc: 'An HTTP client error',
      },
    },
  },
};
