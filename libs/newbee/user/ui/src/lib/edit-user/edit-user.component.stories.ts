import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testAuthenticator1,
  testUser1,
  testUser2,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { EditUserComponent } from './edit-user.component';

export default {
  title: 'EditUserComponent',
  component: EditUserComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    user: testUser1,
    authenticators: [testAuthenticator1],
    editPending: false,
    addAuthenticatorPending: false,
    editAuthenticatorPending: new Set(),
    deleteAuthenticatorPending: new Set(),
    deletePending: false,
    httpClientError: null,
  },
  argTypes: {
    edit: { action: 'edit' },
    addAuthenticator: { action: 'addAuthenticator' },
    editAuthenticator: { action: 'editAuthenticator' },
    deleteAuthenticator: { action: 'deleteAuthenticator' },
    delete: { action: 'delete' },
  },
} as Meta<EditUserComponent>;

type Story = StoryObj<EditUserComponent>;

export const Primary: Story = {};

export const OptionalsExcluded: Story = {
  args: { user: testUser2 },
};

export const EditPending: Story = { args: { editPending: true } };

export const AddAuthenticatorPending: Story = {
  args: { addAuthenticatorPending: true },
};

export const AddAuthenticatorError: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        [`${Keyword.Authenticator}-${Keyword.New}`]: 'Some error',
      },
    },
  },
};

export const EditAuthenticatorPending: Story = {
  args: { editAuthenticatorPending: new Set([testAuthenticator1.id]) },
};

export const DeleteAuthenticatorPending: Story = {
  args: {
    deleteAuthenticatorPending: new Set([testAuthenticator1.id]),
  },
};

export const DeletePending: Story = { args: { deletePending: true } };

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        name: 'Name error',
        displayName: 'Display name error',
        phoneNumber: 'Phone number error',
        [`${Keyword.User}-${Keyword.Edit}`]: 'user-edit error',
        [`${Keyword.User}-${Keyword.Delete}`]: 'user-delete error',
        [`${Keyword.Authenticator}-${Keyword.New}`]: 'authenticator-new error',
        [`${Keyword.Authenticator}-${Keyword.Edit}-${testAuthenticator1.id}`]:
          'authenticator-edit-1 error',
        [`${Keyword.Authenticator}-${Keyword.Delete}-${testAuthenticator1.id}`]:
          'authenticator-delete-1 error',
      },
    },
  },
};
