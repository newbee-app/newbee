import { ClickWrapperComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  OrgRoleEnum,
  TeamRoleEnum,
  testOrgMember1,
  testOrganization1,
  testTeam1,
  testTeamMember1,
} from '@newbee/shared/util';
import {
  Meta,
  StoryObj,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { EditTeamComponent } from './edit-team.component';

export default {
  title: 'EditTeamComponent',
  component: EditTeamComponent,
  decorators: [
    moduleMetadata({ imports: [ClickWrapperComponent] }),
    componentWrapperDecorator(
      (story) => `<newbee-click-wrapper>${story}</newbee-click-wrapper>`,
    ),
  ],
  args: {
    organization: testOrganization1,
    team: testTeam1,
    orgMember: testOrgMember1,
    teamMember: testTeamMember1,
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
} as Meta<EditTeamComponent>;

type Story = StoryObj<EditTeamComponent>;

export const Primary: Story = {};

export const TeamModerator: Story = {
  args: {
    orgMember: { ...testOrgMember1, role: OrgRoleEnum.Member },
    teamMember: { ...testTeamMember1, role: TeamRoleEnum.Moderator },
  },
};

export const TeamWithDuration: Story = {
  args: {
    team: { ...testTeam1, upToDateDuration: 'P1Y' },
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
      status: 500,
      messages: {
        [`${Keyword.Team}-${Keyword.Edit}`]: `team-edit error`,
        [`${Keyword.Team}-${Keyword.Slug}-${Keyword.Edit}`]:
          'team-slug-edit error',
        [`${Keyword.Team}-${Keyword.Delete}`]: 'team-delete error',
      },
    },
  },
};
