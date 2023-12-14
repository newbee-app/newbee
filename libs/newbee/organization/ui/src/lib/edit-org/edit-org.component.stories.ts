import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  OrgRoleEnum,
  testOrganization1,
  testOrgMember1,
} from '@newbee/shared/util';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { EditOrgComponent } from './edit-org.component';

export default {
  title: 'EditOrgComponent',
  component: EditOrgComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    organization: testOrganization1,
    orgMember: testOrgMember1,
    slugTaken: false,
    editPending: false,
    editSlugPending: false,
    checkPending: false,
    deletePending: false,
    httpClientError: null,
  },
  argTypes: {
    slug: { action: 'slug' },
    formattedSlug: { action: 'formattedSlug' },
    edit: { action: 'edit' },
    editSlug: { action: 'editSlug' },
    delete: { action: 'delete' },
  },
} as Meta<EditOrgComponent>;

type Story = StoryObj<EditOrgComponent>;

export const Primary: Story = {};

export const NotOwner: Story = {
  args: {
    orgMember: { ...testOrgMember1, role: OrgRoleEnum.Moderator },
  },
};

export const SlugTaken: Story = { args: { slugTaken: true } };

export const EditPending: Story = { args: { editPending: true } };

export const EditSlugPending: Story = { args: { editSlugPending: true } };

export const CheckPending: Story = { args: { checkPending: true } };

export const DeletePending: Story = { args: { deletePending: true } };

export const WithErrors: Story = {
  args: {
    httpClientError: {
      status: 400,
      messages: {
        name: 'name error',
        num: 'num error',
        frequency: 'frequency error',
        upToDateDuration: 'upToDateDuration error',
        [`${Keyword.Organization}-${Keyword.Edit}`]: 'org-edit error',
        [`${Keyword.Organization}-${Keyword.Slug}-${Keyword.Edit}`]:
          'org-slug-edit error',
        [`${Keyword.Organization}-${Keyword.Delete}`]: 'org-delete error',
      },
    },
  },
};
